from django import forms

from common.forms import StyledFieldsMixin
from main.models import Lesson

class LessonForm(StyledFieldsMixin, forms.ModelForm):
    class Meta:
        model = Lesson
        fields = ["title", "description", "video"]
        widgets = {
            "description": forms.Textarea(attrs={"rows": 4}),
            "video": forms.FileInput(attrs={"accept": "video/*"}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["title"].widget.attrs.update({"maxlength": "255"})
        self.fields["description"].widget.attrs.update({"maxlength": "2000"})
        self._apply_widget_classes()
