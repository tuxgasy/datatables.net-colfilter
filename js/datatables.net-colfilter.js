(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD
        define (["jquery", "datatables.net"], function ($) {
            return factory ($, window, document);
        });
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = function (root, $) {
            if (!root) {
                root = window;
            }
            if (!$ || !$.fn.dataTable) {
                $ = require("datatables.net")(root, $).$;
            }
            return factory($, root, root.document);
        };
    } else {
        // Brower
        factory(jQuery, window, document);
    }
}(function ($, window, document, undefined) {
    'use strict';
    var DataTable = $.fn.dataTable;
    var FILTER_SELECTOR = '.col-filter';
    var FILTER_APPLY_SELECTOR = '.col-filter-apply';
    var FILTER_RESET_SELECTOR = '.col-filter-reset';

    DataTable.colFilter = {};

    /**
     * Initialize
     */
    DataTable.colFilter.init = function(dt) {
        var ctx = dt.settings()[0];
        if (ctx.oInit.colFilter !== true) {
            return;
        }

        ctx._colFilter = {};
        ctx._colFilter.filter = $(FILTER_SELECTOR);
        ctx._colFilter.filterInput = $('input'+FILTER_SELECTOR);
        ctx._colFilter.filterSelect = $('select'+FILTER_SELECTOR);
        ctx._colFilter.filterApply = $(FILTER_APPLY_SELECTOR);
        ctx._colFilter.filterReset = $(FILTER_RESET_SELECTOR);

        // Handle input apply
        ctx._colFilter.filterInput.keypress(function(e) {
            var keycode = (e.keyCode ? e.keyCode : e.which);
            if (keycode != 13) {
                return true;
            }

            ctx._colFilter.filterApply.trigger('click');
            return false;
        });

        ctx._colFilter.filterSelect.change(function(e) {
            ctx._colFilter.filterApply.trigger('click');
        });

        // Apply all filters
        ctx._colFilter.filterApply.click(function(e) {
            $.each(ctx._colFilter.filter, function(index, item) {
                if ($(item).data('col-filter') == undefined && $(item).data('col-name-filter') == undefined) {
                    return;
                }

                var column = $(item).data('col-filter') !== undefined ? $(item).data('col-filter') : $(item).data('col-name-filter')+':name';
                var value = $(item).val();

                dt.column(column).search(value);
            });

            dt.draw();
        });

        // Reset all filters
        ctx._colFilter.filterReset.click(function(e) {
            dt.search('').columns().search('');

            $.each(ctx._colFilter.filter, function(index, item) {
                $(item).val('');
            });

            dt.draw();
        });
    };

    $(document).on('init.dt', function(e, ctx, json) {
        if (e.namespace !== 'dt') {
            return;
        }

        DataTable.colFilter.init(new DataTable.Api(ctx));
    });

    return DataTable.colFilter;
}));
