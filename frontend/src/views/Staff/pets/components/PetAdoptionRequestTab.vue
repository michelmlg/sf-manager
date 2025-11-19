<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import {
  FileText,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Ban,
  Check
} from 'lucide-vue-next';

import Pagination from '@/components/Pagination.vue';
import BaseButton from '@/components/BaseButton.vue';
import { formatarData } from '@/utils/format/index.js';
import { showToast } from '@/utils/uiAlerts/toast';

const props = defineProps({ petId: String });

// estado principal
const loading = ref(false);
const requests = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(20);
const search = ref('');

// revisão
const selectedRequest = ref(null);
const showReviewModal = ref(false);
const reviewNotes = ref('');
const isReviewing = ref(false);

// helpers visuais (mesmos da página principal)
function getStatusColor(status) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getStatusIcon(status) {
  switch (status) {
    case 'pending':
      return Clock;
    case 'approved':
      return Check;
    case 'rejected':
      return Ban;
    default:
      return Clock;
  }
}

function getStatusText(status) {
  switch (status) {
    case 'pending':
      return 'Pendente';
    case 'approved':
      return 'Aprovado';
    case 'rejected':
      return 'Rejeitado';
    default:
      return 'Desconhecido';
  }
}

// buscar solicitações
async function fetchRequests() {
  if (!props.petId) return;
  loading.value = true;

  try {
    const filters = search.value ? { search: search.value } : {};

    const params = new URLSearchParams({
      page: page.value.toString(),
      pageSize: pageSize.value.toString(),
      filters: JSON.stringify(filters),
    });

    const res = await fetch(`/api/adoption-request/animal/${props.petId}?${params}`);
    if (!res.ok) throw new Error('Erro ao buscar solicitações');
    const json = await res.json();

    requests.value = json.items || [];
    total.value = json.total || 0;
    page.value = json.page || 1;
  } catch (err) {
    console.error(err);
    showToast({ icon: 'error', title: 'Erro ao carregar solicitações' });
  } finally {
    loading.value = false;
  }
}

// abrir modal de revisão
function openReviewModal(request) {
  selectedRequest.value = request;
  reviewNotes.value = '';
  showReviewModal.value = true;
}

// revisar solicitação
async function reviewRequest(action) {
  if (!selectedRequest.value) return;
  isReviewing.value = true;

  try {
    const response = await fetch(`/api/adoption-request/${selectedRequest.value.id}/review`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, notes: reviewNotes.value }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao processar revisão');
    }

    const result = await response.json();
    showToast({
      icon: 'success',
      title: 'Revisão realizada!',
      description: result.message,
    });

    showReviewModal.value = false;
    await fetchRequests(); // atualiza lista
  } catch (error) {
    console.error('Erro ao revisar pedido:', error);
    showToast({
      icon: 'error',
      title: 'Erro na revisão',
      description: error.message,
    });
  } finally {
    isReviewing.value = false;
  }
}

// inicialização
onMounted(fetchRequests);
watch([page, pageSize, search], fetchRequests);
</script>

<template>
  <div>
    <!-- Paginação -->
    <Pagination
      :total="total"
      :page="page"
      :pageSize="pageSize"
      :search="search"
      @update:page="val => (page = val)"
      @update:pageSize="val => { pageSize = val; page = 1 }"
      @update:search="val => { search = val }"
    />

    <!-- Tabela -->
    <div class="overflow-x-auto bg-card rounded-lg shadow-sm animate-fade-in">
      <table class="w-full table-auto text-sm">
        <thead class="text-muted-foreground bg-ong-popover uppercase text-xs">
          <tr>
            <th class="px-4 py-3 text-left"></th>
            <th class="px-4 py-3 text-left">Responsável</th>
            <th class="px-4 py-3 text-left">Telefone</th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-left">Data do Pedido</th>
            <th class="px-4 py-3 text-center">Ações</th>
          </tr>
        </thead>
        <tbody class="text-card-foreground">
          <tr
            v-for="req in requests"
            :key="req.id"
            class="border-t hover:bg-gray-50 transition-colors"
          >
            <td class="">
              <div class="w-8 h-8 bg-ong-primary/10 rounded-full flex items-center justify-center">
                <FileText class="h-4 w-4 text-ong-primary" />
              </div>
            </td>
            <td class="px-4 py-3 font-medium">{{ req.responsibleName || 'Não informado' }}</td>
            <td class="px-4 py-3">{{ req.contactPhone || '-' }}</td>
            <td class="px-4 py-3">
              <span
                :class="[
                  'px-2 py-0.5 text-xs rounded-full font-semibold inline-flex items-center gap-1',
                  getStatusColor(req.status)
                ]"
              >
                <component :is="getStatusIcon(req.status)" class="w-3 h-3" />
                {{ getStatusText(req.status) }}
              </span>
            </td>
            <td class="px-4 py-3">{{ formatarData(req.submittedAt) }}</td>
            <td class="px-4 py-3 text-center">
              <div class="flex justify-center gap-2">
                <BaseButton
                  :icon="Eye"
                  variant="default"
                  size="sm"
                  title="Ver detalhes"
                  @click="$emit('openRequestDetails', req)"
                />
                <BaseButton
                  v-if="req.status === 'pending'"
                  :icon="CheckCircle"
                  variant="success"
                  size="sm"
                  title="Revisar"
                  @click="openReviewModal(req)"
                />
              </div>
            </td>
          </tr>

          <tr v-if="!requests.length && !loading">
            <td colspan="6" class="text-center py-3 text-muted-foreground">
              Nenhuma solicitação encontrada
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de Revisão -->
    <div
      v-if="showReviewModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      @click="showReviewModal = false"
    >
      <div
        class="bg-white rounded-lg p-6 w-full max-w-md shadow-xl animate-scale-in"
        @click.stop
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-ong-text">Revisar Solicitação</h2>
          <button @click="showReviewModal = false" class="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>

        <div v-if="selectedRequest" class="space-y-4">
          <p class="text-sm text-muted-foreground text-center">
            Pedido de <strong>{{ selectedRequest.responsibleName }}</strong> para adotar
            <strong>{{ selectedRequest.animal?.name || 'Animal' }}</strong>
          </p>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Observações (opcional)
            </label>
            <textarea
              v-model="reviewNotes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-ong-primary"
              placeholder="Adicione observações sobre a decisão..."
            ></textarea>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              @click="reviewRequest('approve')"
              :disabled="isReviewing"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              <CheckCircle class="w-4 h-4" />
              {{ isReviewing ? 'Processando...' : 'Aprovar' }}
            </button>
            <button
              @click="reviewRequest('reject')"
              :disabled="isReviewing"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              <XCircle class="w-4 h-4" />
              {{ isReviewing ? 'Processando...' : 'Rejeitar' }}
            </button>
          </div>

          <button
            @click="showReviewModal = false"
            class="w-full px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 mt-2"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
