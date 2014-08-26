/**
 * Plugin: "paging_footer" (selectize.js)
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

Selectize.define('paging_footer', function (options) {
    var self = this;
    self.isOpenDropdownWhenOptionsEmpty = true;
    self.ignoreMouseDownClass = "always-fixed";
    self.isKeepTextBoxValue = true;

    options = $.extend({
        pagesize:10,
        html:function (data) {
            return (
                '<div class="always-fixed">' +
                    '<div class="pagination">' +
                    '<input class ="pagination-first-btn" type="button" id="' + self.$input.context.id + '_navi_first" value="<<" />' +
                    '<input class="pagination-previous-btn" type="button" id="' + self.$input.context.id + '_navi_previous" value="<" />' +
                    '<span class="pagination-info"><span id="' + self.$input.context.id + '_paging_current_page"></span>/<span id="' + self.$input.context.id + '_paging_max_page"></span></span>' +
                    '<input class="pagination-next-btn" type="button" id="' + self.$input.context.id + '_navi_next" value=">" />' +
                    '<input class="pagination-last-btn" type="button" id="' + self.$input.context.id + '_navi_last" value=">>" />' +
                    '</div>' +
                    '</div>'
                );
        }
    }, options);

    self.setup = (function () {
        var original = self.setup;
        return function () {
            original.apply(self, arguments);
            self.$paging_footer = $(options.html(options));
            self.$dropdown.append(self.$paging_footer);

            // pagination function register
            self.$pagination = new Object();
            self.$pagination.current_page = 1;
            self.$pagination.url = options.url;
            self.$pagination.query = "";
            self.$pagination.page_size = options.pagesize;

            self.$pagination.load = function () {
                $.support.cors = true;
                $.ajax({
                    url:self.$pagination.url + '?page=' + self.$pagination.current_page + '&query=' + self.$pagination.query,
                    type:'GET',
                    success:function (res) {
                        // set page information
                        var max_page = Math.ceil(parseInt(res.total) / parseInt(res.pageSize));
                        self.$pagination.max_page = max_page;

                        self.isKeepInputValue = true;

                        $('#' + self.$input.context.id + '_paging_max_page').html(max_page);
                        $('#' + self.$input.context.id + '_paging_current_page').html(self.$pagination.current_page);

                        self.clearOptions();
                        $.each(res.data, function (i) {
                            self.addOption(res.data[i]);
                        });
                        self.refreshOptions(false);
                        self.positionDropdown();
                        self.isKeepInputValue = false;
                        if ($.browser.msie) {
                            if ($(document.activeElement).hasClass(self.ignoreMouseDownClass) || $(document.activeElement).parents('.' + self.ignoreMouseDownClass).length > 0) {
                                // TODO IE hack blur
                            }
                        }
                    },
                    error:function (XMLHttpRequest, textStatus, errorThrown) {
                        console.log('=============' + errorThrown);
                    }
                });
            };

            /**
             * refresh pagination buttons state
             */
            self.$pagination.refreshButtonState = function () {
                if (self.$pagination.current_page == 1) {
                    $('#' + self.$input.context.id + '_navi_first').attr("disabled", "disabled");
                    $('#' + self.$input.context.id + '_navi_previous').attr("disabled", "disabled");
                } else {
                    $('#' + self.$input.context.id + '_navi_first').removeAttr("disabled");
                    $('#' + self.$input.context.id + '_navi_previous').removeAttr("disabled");
                }

                if (self.$pagination.current_page == self.$pagination.max_page) {
                    $('#' + self.$input.context.id + '_navi_next').attr("disabled", "disabled");
                    $('#' + self.$input.context.id + '_navi_last').attr("disabled", "disabled");
                } else {
                    $('#' + self.$input.context.id + '_navi_next').removeAttr("disabled");
                    $('#' + self.$input.context.id + '_navi_last').removeAttr("disabled");
                }
            };

//            self.settings.searchField = 'name';
            self.settings.preload = 'focus';
            self.isDataLoaded = false;
            self.settings.create = false;
            //self.render.load = self.$pagination.load;
            self.render.option = function (item, escape) {
                return '<div>' +
                    '<span class="name">' + item.name + '</span>';
            };

            self.settings.load = function (query, callback) {
                // always load data from remote server
                // if (!query.length) return callback();
                self.$pagination.query = query;
                self.$pagination.current_page = 1;
                self.$pagination.load();
                self.$pagination.refreshButtonState();
            }

            //navi buttons listener
            $('#' + self.$input.context.id + '_navi_first').click(function () {
                if (self.$pagination.current_page != 1) {
                    self.$pagination.current_page = 1;
                    self.$pagination.load();
                    self.$pagination.refreshButtonState();
                }
            });
            $('#' + self.$input.context.id + '_navi_previous').click(function () {
                if (self.$pagination.current_page != 1) {
                    self.$pagination.current_page -= 1;
                    self.$pagination.load();
                    self.$pagination.refreshButtonState();
                }
            });
            $('#' + self.$input.context.id + '_navi_next').click(function () {
                if (self.$pagination.current_page != self.$pagination.max_page) {
                    self.$pagination.current_page += 1;
                    self.$pagination.load();
                    self.$pagination.refreshButtonState();
                }
            });
            $('#' + self.$input.context.id + '_navi_last').click(function () {
                if (self.$pagination.current_page != self.$pagination.max_page) {
                    self.$pagination.current_page = self.$pagination.max_page;
                    self.$pagination.load();
                    self.$pagination.refreshButtonState();
                }
            });
        };
    })();


});
