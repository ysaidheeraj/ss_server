from rest_framework.response import Response
from rest_framework import status

def create_model_response(model, serialized_data, status=status.HTTP_200_OK):
    """
    Create a response with the model name as key and serialized data as value.
    """
    response_data = {
        model.__name__: serialized_data
    }
    return response_data