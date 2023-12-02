from django.core.mail import send_mail, EmailMultiAlternatives
from django.utils.html import strip_tags
from django.template.loader import render_to_string
from django.conf import settings
import base64, json

def send_customer_ticket_to_seller(store, seller, customer, subject, mailBody):

    context = {
        "user_name": seller.first_name + " " + seller.last_name,
        "mailBody" : mailBody,
        "storeName" : store.store_name
    }

    html_message = render_to_string("CustomerIssue.html", context=context)
    plain_message = strip_tags(html_message)
    
    if settings.ENABLE_EMAILS:
        email = EmailMultiAlternatives(
            subject="Customer Issue: "+subject,
            body=plain_message,
            from_email=store.store_name + " " + settings.DEFAULT_FROM_MAIL,
            to=[seller.email],
            reply_to=[customer.email]
        )

        email.attach_alternative(html_message, "text/html")
        email.send()