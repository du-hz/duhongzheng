<template>
  <div>
    <li class="timeline-title" :style="itemStyle">
      <div class="timeline-circle timeline-title-circle" :class="slotClass" :style="circleStyle" ref="others">
        <slot name="others" />
      </div>
      <slot />
    </li>
  </div>
</template>

<script>
import timelineItemBase from '@/components/common/timeline/timelineItemBase'

export default {
  extends: timelineItemBase
}
</script>
