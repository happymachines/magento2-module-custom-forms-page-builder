define([
    'jquery',
    'knockout',
    'mage/translate',
    'underscore',
    'Magento_PageBuilder/js/events',
    'Magento_PageBuilder/js/config',
    'Magento_PageBuilder/js/utils/object',
    'Magento_PageBuilder/js/widget-initializer',
    'Magento_PageBuilder/js/content-type/preview'
], function ($, ko, $t, _, events, config, dataObject, widgetInitializer, PreviewBase) {
   'use strict';

   class Preview extends PreviewBase {
       constructor(contentType, config, observableUpdater) {
           super(contentType, config, observableUpdater);

           this.displayingPreview = ko.observable(false);
           this.loading = ko.observable(false);
           this.element = null;
           this.messages = {
               NOT_SELECTED: $t("No Form Selected"),
               NO_RESULTS: $t("No form data loaded."),
               UNKNOWN_ERROR: $t("An unknown error occurred. Please try again."),
           };
           this.lastFormId = null;
           this.lastRenderedHtml = '';
           this.placeholderText = ko.observable(this.messages.NOT_SELECTED);
       }

       /**
        * Runs the widget initializer for each configured widget
        */
       initializeWidgets(element) {
           if (element) {
               this.element = element;
               widgetInitializer({
                   config: config.getConfig("widgets"),
                   breakpoints: config.getConfig("breakpoints"),
               }, element);
           }
       }

       /**
        * Updates the view state using the data provided
        * @param {DataObject} data
        */
       processData(data) {
           // Only load if something changed
           this.displayPreviewPlaceholder(data, "form_id");
           if (data.form_id) {
               this.processRequest(data, "form_id", "title");
           }
       }

       /**
        * @inheritdoc
        */
       afterObservablesUpdated() {
           super.afterObservablesUpdated();

           const data = this.contentType.dataStore.getState();

           // Only load if something changed
           this.processData(data);
       }

       /**
        * Display preview placeholder
        *
        * @param {DataObject} data
        * @param {string} identifierName
        */
       displayPreviewPlaceholder(data, identifierName) {
           const formId = dataObject.get(data, identifierName);
           // Only load if something changed
           if (this.lastFormId === formId) {
               // The mass converter will have transformed the HTML property into a directive
               if (this.lastRenderedHtml) {
                   this.data.main.html(this.lastRenderedHtml);
                   this.showPreview(true);
                   this.initializeWidgets(this.element);
               }
           } else {
               this.showPreview(false);
               this.placeholderText("");
           }

           if (!formId) {
               this.showPreview(false);
               this.placeholderText(this.messages.NOT_SELECTED);
               return;
           }
       }

       /**
        *
        * @param {DataObject} data
        * @param {string} identifierName
        * @param {string} labelKey
        */
       processRequest(data, identifierName, labelKey) {
           const url = config.getConfig("preview_url");
           const identifier = dataObject.get(data, identifierName);
           const requestConfig = {
               // Prevent caching
               method: "POST",
               data: {
                   role: this.config.name,
                   form_id: identifier,
                   directive: this.data.main.html(),
               },
           };

           this.loading(true);
           // Retrieve a state object representing the product attributes from the preview controller and process it on the stage
           $.ajax(url, requestConfig)
               .done((response) => {
                   // Empty content means something bad happened in the controller that didn't trigger a 5xx
                   // Confirm that the response content is not empty
                   if (typeof response.data !== "object" || !Boolean(/\S/.test(response.data.content))) {
                       this.showPreview(false);
                       this.placeholderText(this.messages.NO_RESULTS);

                       return;
                   }

                   if (response.data.content) {
                       this.showPreview(true);
                       this.data.main.html(response.data.content);
                       this.initializeWidgets(this.element);
                   } else if (response.data.error) {
                       this.showPreview(false);
                       this.placeholderText(response.data.error);
                   }

                   this.lastFormId = identifier
                   this.lastRenderedHtml = response.data.content;
               })
               .fail(() => {
                   this.showPreview(false);
                   this.placeholderText(this.messages.UNKNOWN_ERROR);
               })
               .always(() => {
                   this.loading(false);
               });
       }

       showPreview(isDisplayed) {
           this.displayingPreview(isDisplayed);
       }
   }

    return Preview;
});
