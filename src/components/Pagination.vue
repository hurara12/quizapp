<template>
    <ul class="pagination">
        <!-- Previous Page Button -->
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="prevPage">Previous</a>
        </li>

        <!-- First page and ellipsis if needed -->
        <li v-if="currentPage > 3" class="page-item">
            <a class="page-link" href="#" @click.prevent="goToPage(1)">1</a>
        </li>

        <li v-if="currentPage > 3" class="page-item disabled">
            <span class="page-link">...</span>
        </li>

        <!-- Visible pages -->
        <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: currentPage === page }">
            <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
        </li>

        <!-- Last page and ellipsis if needed -->
        <li v-if="currentPage < totalPages - 2" class="page-item disabled">
            <span class="page-link">...</span>
        </li>
        <li v-if="currentPage < totalPages - 2" class="page-item">
            <a class="page-link" href="#" @click.prevent="goToPage(totalPages)">{{ totalPages }}</a>
        </li>

        <!-- Next Page Button -->
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="nextPage">Next</a>
        </li>
    </ul>
</template>

<script>
import { computed, toRefs } from 'vue';

export default {
    name: 'PaginationComponent',
    props: {
        currentPage: {
            type: Number,
            required: true,
        },
        totalPages: {
            type: Number,
            required: true,
        },
    },
    emits: ['updatePage'],
    setup(props, { emit }) {
        const { currentPage, totalPages } = toRefs(props);

        const visiblePages = computed(() => {
            let start = Math.max(1, currentPage.value - 2);
            let end = Math.min(totalPages.value, currentPage.value + 2);
            let pages = [];
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            return pages;
        });

        const goToPage = (page) => {
            emit('updatePage', page);
        };

        const prevPage = () => {
            if (currentPage.value > 1) {
                goToPage(currentPage.value - 1);
            }
        };

        const nextPage = () => {
            if (currentPage.value < totalPages.value) {
                goToPage(currentPage.value + 1);
            }
        };

        return {
            visiblePages,
            goToPage,
            prevPage,
            nextPage,
        };
    },
};
</script>

<style scoped>
.pagination {
    justify-content: center;
    margin-top: 15px;
}

.page-item.disabled .page-link {
    pointer-events: none;
    opacity: 0.5;
}

.page-item.active .page-link {
    background-color: #007bff;
    border-color: #007bff;
}
</style>
