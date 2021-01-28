<template>
    <teleport
        to="#modal-container"
    >
        <transition name="fade">
            <div
                v-if="value"
                class="modal-background"
                @click="value=false"
            >
                <div
                    class="modal"
                    @click.stop
                >
                    <div class="icons">
                        <i
                            class="las la-expand"
                            @click="$emit('expand')"
                        />
                        <i
                            class="las la-times"
                            @click="value=false"
                        />
                    </div>
                    <slot />
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    name: "UIModal",
    props: {
        modelValue: {
            type: Boolean
        }
    },
    emits: ["update:modelValue", "expand"],
    data () {
        return {
            value: false
        };
    },
    watch: {
        modelValue: {
            immediate: true,
            handler () {
                this.value = this.modelValue;
                document.body.style.overflow = this.value ? "hidden" : "unset";
            }
        },
        value () {
            this.$emit("update:modelValue", this.value);
        }
    },
    unmounted () {
        document.body.style.overflow = "unset";
    }

});
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
    transition: opacity var(--duration-fast);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.modal-background {
    z-index: 100;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;

    .icons {
        position: absolute;
        top: 0;
        right: 0;
        margin-right: var(--length-padding-l);

        .las {
            padding: var(--length-padding-base);
            display: inline-block;
            color: var(--color-content-50);
            cursor: pointer;

            &:hover {
                color: var(--color-primary);
            }
        }
    }

    .modal {
        border-radius: var(--length-radius-base);
        box-shadow: 0 0 10px var(--color-shadow);
        background: var(--color-content-background);
        border: 1px solid var(--color-content-light);
        position: relative;
    }
}
</style>
