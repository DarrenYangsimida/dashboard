<!--
 * Copyright 2022 The kubegems.io Authors
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *       http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. 
-->

<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-flex :class="expand ? 'kubegems__overlay' : ''" />
    <BaseSubTitle :title="$root.$t('form.definition', [$t('tip.graph')])" />
    <v-card-text class="pa-2">
      <v-row>
        <v-col cols="6">
          <v-autocomplete
            v-model="mode"
            class="my-0"
            color="primary"
            :items="modeItems"
            :label="$t('tip.mode')"
            :no-data-text="$root.$t('data.no_data')"
            :readonly="edit"
            :rules="objRules.modeRule"
            @change="onModeChanged"
          >
            <template #selection="{ item }">
              <v-chip class="mx-1" color="primary" small>
                {{ item['text'] }}
              </v-chip>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="obj.name" class="my-0" :label="$t('tip.name')" required :rules="objRules.nameRule" />
        </v-col>
        <v-col v-if="mode === 'ql'" cols="6">
          <v-autocomplete
            v-model="obj.unit"
            class="my-0"
            color="primary"
            :items="unitItems"
            :label="$t('tip.unit')"
            :no-data-text="$root.$t('data.no_data')"
            :search-input.sync="unitText"
            @keydown.enter="createUnit"
          >
            <template #selection="{ item }">
              <v-chip class="mx-1" color="primary" small>
                {{ item['text'] }}
              </v-chip>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
    </v-card-text>

    <RuleForm
      ref="ruleForm"
      class="kubegems__forminform"
      :generator="generator"
      :mode="mode"
      :targets="obj.targets"
      @addData="addData"
      @closeOverlay="closeExpand"
    />
    <BaseSubTitle :title="$t('tip.rule_conifg')" />
    <v-card-text class="pa-2">
      <RuleItem
        :mode="mode"
        :rules="obj.targets"
        @expandCard="expandCard"
        @removeRule="removeRule"
        @updateRule="updateRule"
      />
    </v-card-text>
  </v-form>
</template>

<script>
  import { addCustomUnit, getUnitItems } from '@kubegems/api/hooks/metrics';
  import { required } from '@kubegems/extension/ruler';
  import { deepCopy } from '@kubegems/libs/utils/helpers';
  import { mapState } from 'vuex';

  import messages from '../../../i18n';
  import RuleForm from './RuleForm';
  import RuleItem from './RuleItem';

  export default {
    name: 'GraphBaseForm',
    i18n: {
      messages: messages,
    },
    components: {
      RuleForm,
      RuleItem,
    },
    props: {
      edit: {
        type: Boolean,
        default: () => false,
      },
      item: {
        type: Object,
        default: () => null,
      },
    },
    data() {
      this.unitItems = getUnitItems();

      return {
        valid: false,
        obj: {
          name: '',
          targets: [],
          unit: '',
        },
        objRules: {
          nameRule: [required],
          modeRule: [required],
        },
        mode: 'template',
        expand: false,
        unitText: '',
      };
    },
    computed: {
      ...mapState(['AdminViewport']),
      modeItems() {
        return [
          { text: this.$t('tab.generate_from_template'), value: 'template' },
          { text: this.$t('tab.generate_from_promql'), value: 'ql' },
        ];
      },
    },
    watch: {
      item: {
        handler(newValue) {
          if (newValue) {
            this.obj = deepCopy(newValue);
            this.mode = this.obj.targets.some((t) => {
              return t.expr;
            })
              ? 'ql'
              : 'template';
            this.unitItems = getUnitItems(addCustomUnit(this.obj.unit));
          }
        },
        deep: true,
        immediate: true,
      },
    },
    methods: {
      onModeChanged() {
        this.obj.targets = [];
      },
      validate() {
        return this.$refs.form.validate(true);
      },
      addData(data) {
        this.obj.targets = data;
        this.$refs.ruleForm.close();
      },
      getData() {
        if (this.mode === 'template') {
          const units = Array.from(
            new Set(
              this.obj.targets.map((t) => {
                return t.promqlGenerator.unit;
              }),
            ),
          );
          if (units && units.length > 1) {
            this.$store.commit('SET_SNACKBAR', {
              text: this.$t('tip.unit_ununique'),
              color: 'warning',
            });
            return;
          }
          this.obj.unit = units[0];
        }
        return this.obj;
      },
      reset() {
        this.$refs.form.resetValidation();
        this.obj = this.$options.data().obj;
        if (this.$refs.ruleForm) {
          this.$refs.ruleForm.close();
        }
        this.mode = 'template';
      },
      insertMetrics(metrics) {
        this.$set(this.obj, 'expr', metrics);
        this.$forceUpdate();
      },

      expandCard(formComponent) {
        this.$nextTick(() => {
          this.$refs[formComponent].expand();
          this.expand = true;
        });
      },
      closeExpand() {
        this.expand = false;
      },
      removeRule(index) {
        this.$delete(this.obj.targets, index);
      },
      updateRule(index) {
        const rule = this.obj.targets[index];
        const data = {
          index: index,
          targetName: rule.targetName,
          promqlGenerator: rule.promqlGenerator,
          expr: rule.expr,
        };
        this.$nextTick(() => {
          this.$refs.ruleForm.init(data, data.promqlGenerator);
          this.expand = true;
        });
      },
      createUnit() {
        if (this.unitText) {
          this.unitItems = getUnitItems(addCustomUnit(this.unitText));
          this.unitText = '';
        }
      },
    },
  };
</script>
