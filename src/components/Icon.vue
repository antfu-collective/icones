<script lang="ts">
import { defineComponent, h } from 'vue'

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true
    },
    inline: {
      type: Boolean,
      default: true
    }
  },
  setup(props, {attrs}) {
    return () =>
      h(
        'span',
        {
          class: attrs.class + ' iconify',
          'data-icon': props.icon,
          'data-inline': props.inline.toString(),
        },
        []
      )
  }
})
</script>