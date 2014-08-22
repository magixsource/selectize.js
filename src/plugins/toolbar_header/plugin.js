/**
 * Plugin: "toolbar_header" (selectize.js)
 * Copyright (c) 2014 linpeng
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author linpeng <magixsource.cn@gmail.com>
 */

Selectize.define('toolbar_header', function (options) {
    if (this.settings.mode === 'single') return;

    var self = this;

    self.isOpenDropdownWhenOptionsEmpty = true;
    self.ignoreMouseDownClass = "always-fixed";

    options = $.extend({
        html:function (data) {
            return (
                '<div class="always-fixed">' +
                    '<input class="select-all-btn" type="button" id="' + self.$input.context.id + '_select_all_btn" class="btn" value="SelectAll">' +
                    '<input class="clear-all-btn" type="button" id="' + self.$input.context.id + '_clear_all_btn" class="btn" value="ClearAll">' +
                    '</div>'
                );
        }
    }, options);

    self.clear = (function () {
        var original = self.clear;
        return function () {
            // Don't remove input in the case of button click
            // modify by linpeng 2014-8-18
            if (self.isKeepInputValue) {
                return;
            }
            original.apply(self, arguments);
        };
    })();

    self.setup = (function () {
        var original = self.setup;
        return function () {
            original.apply(self, arguments);
            self.$toolbar_header = $(options.html(options));
            self.$dropdown.prepend(self.$toolbar_header);

            $('#' + self.$input.context.id + '_select_all_btn').click(function () {
                //self.setValue(this.keys(self.options));
                if (self.settings.mode === 'single') return;
                // last value should be self.options plus current value
                var newArray = $.map(self.options, function (obj) {
                    return obj.value;
                });
                var oldArray = self.getValue();
                newArray = oldArray.concat(newArray);
                // Keep input value
                self.isKeepInputValue = true;
                self.setValue(newArray);
                self.isKeepInputValue = false;
            });

            $('#' + self.$input.context.id + '_clear_all_btn').click(function () {
                self.clear();
                self.refreshOptions(false);
                self.positionDropdown();
            });
        };
    })();


});
