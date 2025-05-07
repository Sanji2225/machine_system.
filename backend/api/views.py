from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Lavanderia, Maquina, Pagamento
from .serializers import LavanderiaSerializer, MaquinaSerializer, PagamentoSerializer, MaquinaStatusSerializer
from datetime import datetime, timedelta

class LavanderiaViewSet(viewsets.ModelViewSet):
    queryset = Lavanderia.objects.all()
    serializer_class = LavanderiaSerializer

class MaquinaViewSet(viewsets.ModelViewSet):
    queryset = Maquina.objects.all()
    serializer_class = MaquinaSerializer

class PagamentoViewSet(viewsets.ModelViewSet):
    queryset = Pagamento.objects.all()
    serializer_class = PagamentoSerializer

    def perform_create(self, serializer):
        pagamento = serializer.save()
        if pagamento.aprovado:
            maquina = pagamento.maquina
            maquina.status = "ocupado"
            maquina.previsao_liberacao = datetime.now() + timedelta(hours=1)
            maquina.save()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been used, then clear the cache so that
            # we reload the related objects from the database.
            instance._prefetched_objects_cache = {}
        
        # Custom logic after update if payment is approved
        if instance.aprovado and not instance.maquina.status == "ocupado": # Check if it was not already occupied by this payment
            maquina = instance.maquina
            maquina.status = "ocupado"
            maquina.previsao_liberacao = datetime.now() + timedelta(hours=1) # or some other logic for prediction
            maquina.save()

        return Response(serializer.data)


class ConsultaMaquinaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Maquina.objects.all()
    serializer_class = MaquinaStatusSerializer

    @action(detail=True, methods=["get"])
    def status(self, request, pk=None):
        maquina = self.get_object()
        serializer = MaquinaStatusSerializer(maquina)
        return Response(serializer.data)

