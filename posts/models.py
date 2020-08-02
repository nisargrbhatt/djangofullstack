from django.db import models

# Create your models here.


class PostModel(models.Model):
    title = models.CharField(max_length=140)
    content = models.TextField()
    creator = models.CharField(max_length=140)
