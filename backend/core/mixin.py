from typing import Any


class SerializerByActionMixin:
  """
  Mixin reutilizable para ViewSts
  """

  serializer_map: dict[str, Any] = {}

  action: str

  def get_serializer_class(self):
    serializer_class = self.serializer_map.get(self.action)

    if serializer_class:
      return serializer_class
    
    return super().get_serializer_class() # type: ignore[misc]