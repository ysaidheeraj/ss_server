from django.core.mail import send_mail, EmailMultiAlternatives
from django.utils.html import strip_tags
from django.template.loader import render_to_string
from django.conf import settings

def send_order_status_update_email(order):
    customer = order['customer']
    orderStatusText = {
        0: "Confirmed",
        1: "Paid",
        2: "Shipped",
        3: "Cancelled",
        4: "Delivered",
        5: "Returned",
        6: "Refund granted"
    }
    orderStatusMessage = {
        0: "Your order has been confirmed!",
        1: "We have received payment for your order",
        2: "Your order will reach you soon!",
        3: "We are sorry to see you cancel your order! Please let us know if we can do better.",
        4: "Your order has reached your doorstep!",
        5: "Your return is being processed.",
        6: "We have granted refund for your returned order!"
    }
    context = {
        "user_name": customer['first_name'] + " " + customer['last_name'],
        "order_link" : settings.APP_ROOT_URL+"/#/login?redirect=/order/"+str(order['order_id']),
        "orderId": str(order['order_id']),
        "orderStatusText": orderStatusText[order['order_status']],
        "orderStatusMessage": orderStatusMessage[order['order_status']]
    }
    if settings.ENABLE_EMAILS:

        html_message = render_to_string("OrderStatusUpdate.html", context=context)
        plain_message = strip_tags(html_message)

        email = EmailMultiAlternatives(
            subject=f"Update on your order {order['order_id']} from Sell Smart",
            body=plain_message,
            from_email=settings.DEFAULT_FROM_MAIL,
            to=[customer['email']],
            reply_to=[settings.EMAIL_HOST_USER]
        )

        email.attach_alternative(html_message, "text/html")
        email.send()

