from datetime import datetime, timedelta

import math

from rest_framework_simplejwt.tokens import RefreshToken

from faceprojectdb.settings import SIMPLE_JWT as jwt_settings

from .models import *

# these methods are used in views.py register and login 'POST' methods

def extract_user_data_generate_token(user):
    # user is obtained from validated serializer data(register) or authenticated login request in views.register
    # generate JWT token for user
    refresh = RefreshToken.for_user(user)
    # calculate expiration timestamp based on settings.SIMPLE_JWT.ACCESS_TOKEN_LIFETIME (timedelta value)
    token_exp_timestamp = math.trunc(datetime.timestamp(datetime.now() + jwt_settings['ACCESS_TOKEN_LIFETIME']))
    # select the user data that is passed to the client
    logged_user = {
        'id': user.id,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'joined_date': datetime.date(user.created_at),
        'exp': token_exp_timestamp,
        'access': str(refresh.access_token),
#         'refresh': str(refresh),
    }
    return logged_user

# def generate_token(user):
#     # user is obtained from validated serializer data(register) or authenticated login request in views.register
#     refresh = RefreshToken.for_user(user)
#     # calculate expiration timestamp based on settings.SIMPLE_JWT.ACCESS_TOKEN_LIFETIME (timedelta value)
#     token_exp_timestamp = math.trunc(datetime.timestamp(datetime.now() + jwt_settings['ACCESS_TOKEN_LIFETIME']))
#     token = {
#         'exp': token_exp_timestamp,
#         'access': str(refresh.access_token),
#         'refresh': str(refresh),
#     }
#     return token
