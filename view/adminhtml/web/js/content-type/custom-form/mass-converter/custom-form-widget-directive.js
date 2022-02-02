define([
    'Magento_PageBuilder/js/mass-converter/widget-directive-abstract',
    'Magento_PageBuilder/js/utils/object'
], function (widgetDirective, dataObject) {
    'use strict';

    class CustomFormWidgetDirective extends widgetDirective {
        /**
         * Convert value to internal format
         *
         * @param {object} data
         * @param {object} config
         * @returns {object}
         */
        fromDom(data, config) {
            var attributes = super.fromDom(data, config);

            data.template = attributes.template;
            data.form_id = attributes.form_id;

            return data;
        }

        toDom(data, config) {
            var attributes = {
                type: "HappyMachines\\CustomForms\\Block\\Form\\Widget\\Form",
                template: "HappyMachines_CustomForms::form/default.phtml",
                form_id: data.form_id,
            };

            dataObject.set(data, config.html_variable, this.buildDirective(attributes));

            return data;
        }
    }

    return CustomFormWidgetDirective;
});
