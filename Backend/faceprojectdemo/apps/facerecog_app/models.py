from __future__ import unicode_literals
from django.db import models
import re
import bcrypt
NAME_REGEX = re.compile(r'^[a-zA-Z]+$')
EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')

class UserManager(models.Manager):
    def basic_validator(self, postData):
        errors = {}
        if len(postData['first_name']) < 2:
            errors["first_name"] = "First name should be at least 2 characters"
        elif not NAME_REGEX.match(postData['first_name']):
            errors["first_name"] = "First name should only consist of alphanumeric characters (A-Z). No periods or commas"
        if len(postData['last_name']) < 2:
            errors["last_name"] = "Last name should be at least 2 characters"
        elif not NAME_REGEX.match(postData['last_name']):
            errors["last_name"] = "Last name should only consist of alphanumeric characters (A-Z). No periods or commas"
        if not EMAIL_REGEX.match(postData['email']):
            errors["email"] = "Invalid email"
        if len(User.objects.filter(email = postData['email'])) > 0:
            errors["email"] = "Email previously registered. Contact for information on this account (847) 528-1339"
        if len(postData['password']) < 8:
            errors["password"] = "Password should be at least 8 characters"
        if postData['password'] != postData['confirm']:
            errors["confirm"] = "Passwords do not match"
        return errors
    def login_validator(self, postData):
        errors = {}
        if len(User.objects.filter(email = postData['email'])) == 0:
            errors["success"] = "Invalid Login"
        # elif not bcrypt.checkpw(postData['password'].encode(), User.objects.get(email = postData['email']).password.encode():
        #     errors["success"] = "Invalid Login"
        elif not User.objects.get(email = postData['email']).password:
            errors["success"] = "Invalid Login"
        return errors
    def Jsonize(self, trial):
        user = {}
        user['first_name'] = trial.first_name
        user['last_name'] = trial.last_name
        return user
    def reset(self, id, password):
        print(password)
        user = User.objects.get(id=id)
        newpass = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        user.password = newpass
        user.save()
        return

class FaceManager(models.Manager):
    def Jsonize(self, trial):
        face = {}
        face['chin_angle'] = trial.chin_angle
        face['mofa_ratio'] = trial.mofa_ratio
        face['hlmo_angle'] = trial.hlmo_angle
        face['shape'] = trial.shape
        face['image'] = trial.image
        return face
        
class User(models.Model):
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    email = models.CharField(max_length=200)
    password = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    preference = models.IntegerField(default=0)
    objects = UserManager()
    def __repr__(self):
        return "<User object: {} {} {} {}>".format(self.first_name, self.last_name, self.email, self.password)

class Face(models.Model):
    chin_angle = models.FloatField()
    mofa_ratio = models.FloatField()
    hlmo_angle = models.FloatField()
    shape = models.CharField(max_length=200)
    image = models.TextField()
    user = models.ForeignKey(User, related_name = "faces", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    objects = FaceManager()
    def __repr__(self):
        return "<Face object: {} {} {} {} {} {}>".format(self.chin_angle, self.mofa_ratio, self.hlmo_angle, self.shape, self.image, self.user)