from django.db import models


class Lesson(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    video = models.FileField(upload_to="videos/")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self):
        return self.title
