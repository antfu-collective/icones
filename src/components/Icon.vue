<script lang="ts">
import { defineComponent, h } from 'vue'

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true,
    },
  },
  setup(props, { attrs }) {
    return () =>
      h('div', {
        ...attrs,
      }, [
        h(
          'span',
          {
            class: 'iconify',
            'data-icon': props.icon,
          },
          [' '],
        ),
      ])
  },
})
</script>

<style>
span.iconify {
  background: #5551;
  border-radius: 100%;
  min-width: 10px;
  min-height: 1em;
}
</style>
