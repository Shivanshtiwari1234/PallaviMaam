class StyledFieldsMixin:
    """Apply a consistent CSS class set to all form widgets."""

    default_widget_class = "w-full p-2 rounded border"

    def _apply_widget_classes(self):
        for field in self.fields.values():
            css = field.widget.attrs.get("class", "")
            field.widget.attrs["class"] = f"{css} {self.default_widget_class}".strip()

