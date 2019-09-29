from __future__ import unicode_literals
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
import re

NAME_REGEX = re.compile(r'^[a-zA-Z]+$')
EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')

## USER MODELS
class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""
    use_in_migrations = True
    def _create_user(self, email, password, **extra_fields):
        print("********************_create_user********************")
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_user(self, email, password=None, **extra_fields):
        print("********************create_user********************")
        """Create and save a regular User with the given email and password."""
        return self._create_user(email, password, **extra_fields)
    def create_superuser(self, email, password, **extra_fields):
        print("********************create_superuser********************")
        """Create and save a SuperUser with the given email and password."""
        return self._create_user(email, password, **extra_fields)

class User(AbstractUser):
    email = models.EmailField(('email address'), unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    username = None
    date_joined = None
    USERNAME_FIELD = 'email'
    objects = UserManager()
    REQUIRED_FIELDS = []


class FaceManager(models.Manager):
    def Jsonize(self, trial):
        face = {}
        face['chin_angle'] = trial.chin_angle
        face['mofa_ratio'] = trial.mofa_ratio
        face['hlmo_angle'] = trial.hlmo_angle
        face['shape'] = trial.shape
        face['image'] = trial.image
        return face
        


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
