from .models import *
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions
# from django.core.mail import send_mail, EmailMessage

from rest_framework import serializers

import json 

# import sendgrid
# from smtpapi import SMTPAPIHeader

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'password')
        validators = []

    password = serializers.CharField(min_length=8)

    def validate_first_name(self, value):
        if len(value) == 0 or len(value) > 255:
            raise serializers.ValidationError("Invalid first name")
        while value[0] == " ":
            value = value[1:]
        while value[len(value)-1] == " ":
            value = value[:-1]
        return value

    def validate_last_name(self, value):
        if len(value) == 0 or len(value) > 255:
            raise serializers.ValidationError("Invalid last name")
        while value[0] == " ":
            value = value[1:]
        while value[len(value)-1] == " ":
            value = value[:-1]
        return value

    def create(self, validated_data):
        first_name = serializers.CharField(validators=[self.validate_first_name(validated_data['first_name'])])
        last_name = serializers.CharField(validators=[self.validate_last_name(validated_data['last_name'])])
        user = User.objects.create_user(validated_data['email'])
        for key in validated_data:
            setattr(user, key, validated_data[key])
        user.set_password(validated_data['password'])
        user.save()
        return user

    # def update(self, instance, validated_data):
    #     instance.email = validated_data['email']
    #     instance.first_name = validated_data['first_name']
    #     instance.last_name = validated_data['last_name']
    #     instance.save()
    #     return instance

class FaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Face
        fields = ('id', 'chin_angle', 'mofa_ratio', 'hlmo_angle', 'shape', 'image')
