<template>
    <div class="questions">
        <div v-if="questions.length === 0">
            No question found...
        </div>
        <div
            v-for="question in questions"
            :key="question._id"
            class="question"
        >
            <div class="header">
                <span class="title">{{ question.title }}</span>
            </div>
            <div class="sub">
                <span class="date">{{ displayDate(question.date) }}</span>
                <span class="author">by {{ question.name }}</span>
            </div>
            <div
                class="content"
                v-html="question.content"
            />
            <div
                v-if="question.publisherReply"
                class="reply"
            >
                Response:
                <div
                    class="content"
                    v-html="question.publisherReply"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: "ProductQuestions"
};
</script>

<script setup lang="ts">
import ProductService from "@/services/product.service";
import { displayDate } from "@/components/product/product";

const props = defineProps<{
    productId: string;
}>();

const questions = await ProductService.getQuestionsById(props.productId);
</script>

<style scoped lang="scss">
.questions {
    display: flex;
    flex-direction: column;
    gap: var(--length-gap-s);
    padding: var(--length-padding-s) 0;

    .question {
        background: var(--color-background);
        padding: var(--length-padding-base) var(--length-padding-l);
        border-radius: var(--length-radius-base);

        .header {
            display: flex;
            gap: var(--length-gap-s);
            font-weight: 600;
            margin-bottom: var(--length-margin-s);
        }

        .sub {
            display: flex;
            gap: var(--length-gap-s);
            font-size: 0.9rem;
            color: var(--color-content-50);
            margin-bottom: var(--length-margin-base);
        }

        .content {
            color: var(--color-content-70);
        }

        .reply {
            background: var(--color-content-background);
            padding: var(--length-padding-s) var(--length-padding-base);
            margin-bottom: var(--length-margin-s);
            border-radius: var(--length-radius-base);
        }
    }
}
</style>
