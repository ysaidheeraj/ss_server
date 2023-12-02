from django.core.mail import send_mail, EmailMultiAlternatives
from django.utils.html import strip_tags
from django.template.loader import render_to_string
from django.conf import settings
import base64, json

def send_welcome_account_confirmation_email(store, customer):

    context = {
        "user_name": customer.first_name + " " + customer.last_name,
        "account_confirm_link" : settings.APP_ROOT_URL+"/store/"+str(customer.store_id.store_id)+"/storeuser/customer/accountconfirmpage?data="+base64.b64encode(
            json.dumps({"email":customer.email, "storeId": customer.store_id.store_id}).encode('utf-8')).decode("utf-8"),
        "storeName" : store.store_name
    }

    html_message = render_to_string("WelcomeAccConfirm.html", context=context)
    plain_message = strip_tags(html_message)
    
    if settings.ENABLE_EMAILS:
        email = EmailMultiAlternatives(
            subject="Welcome to Sell Smart",
            body=plain_message,
            from_email=store.store_name + " " + settings.DEFAULT_FROM_MAIL,
            to=[customer.email],
            reply_to=[settings.EMAIL_HOST_USER]
        )

        email.attach_alternative(html_message, "text/html")
        email.send()