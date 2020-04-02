<template lang="jade">
.lr-tab-panel
  .lr-title.lr__focus
    .lr-title-content Hello
  .lr-tab-panel-inner
    .lr-tabs
      .lr-tab(v-for="(v,i) in tabs", 
        :class="{lr__active: i === tabIndex}",
        @click="switchTab(i)") {{v}}
    .lr-tab-panel-detail
      div(v-if="tabIndex === 0")
        h1 0 &excl;
        div
          input.lr-input(disabled="disabled", value="haha")
        label.lr-label-input.lr-check-box
          input(type="checkbox", checked="checked", disabled="disabled")
          .lr-box_in
          span Readly Only
        div
          label.lr-label-input.lr-radio
            input(type="radio", name="k")
            .lr-box_radius
            span radio 1
          hr
          label.lr-label-input.lr-radio
            input(type="radio", checked="checked", disabled="disabled", name="k")
            .lr-box_radius
            span radio 2
        hr
        fieldset.lr-fieldset
          legend haha
          | afsdfhdhdhdhhd<br>
          | afsdfhdhdhdhhd
          
      div(v-if="tabIndex === 1")
        h1 1
      div(v-if="tabIndex === 2")
        h1 2
    .lr-tab-panel-footer
      button.lr-btn OK
      button.lr-btn Cancel
      button.lr-btn(disabled="disabled") Apply
    
</template>
<script>
export default {
  data(){
    return {
      tabs: ['General', 'Security', 'Summary'],
      tabIndex: 0
    }
  },
  methods: {
    switchTab(index){
      this.tabIndex = index;
    }
  }
}
</script>