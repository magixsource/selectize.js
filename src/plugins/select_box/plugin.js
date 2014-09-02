/**
 * Plugin: "select_box" (selectize.js)
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

Selectize.define('select_box', function(options) {
    var self = this;

    self.ignoreMouseDownClass = "always-fixed";
    self.$selectbox = new Object();
    self.$selectbox.remove = true;
    var appendHtml = '<a href="javascript:void(0)" class="remove-icon always-fixed" tabindex="-1" title="">&times;</a>';

    self.$selectbox.refreshSelectBox = function(){
        var html = "<ul class='selectbox-container' style='list-style: none;'>";
        self.$control.children(".item").each(function(i){
            var content = $('<div>').append($(this).clone()).html();
            if(self.$selectbox.remove){
                content += appendHtml;
            }
            html+="<li class='selectbox-item'>"+content+"</li>";
        });
        html += "</ul>";
        self.$dropdown.rightContent.html(html);
        // refresh option is necessary and so easy to forget
        self.refreshOptions(false);
    };

    //self.settings.doubleWidth = true;
    options = $.extend({
        headerClass   : 'selectbox-table',
        titleRowClass : 'selectbox-table-ul',
        labelClass    : 'selectbox-table-li',
        headerHtml :function(data){
            var columnsHtml = "";
            if(data.columns){
                $.each(data.columns,function(i){
                    var width = "";
                    if(data.columns[i].width){
                        width = 'width:'+data.columns[i].width;
                    }
                    columnsHtml += '<div class="' + data.labelClass + '" style="'+width+'">' + data.columns[i].title + '</div>';
                });
            }
            return (
                '<div class="' + data.headerClass + '">' +
                    '<div style="font-weight: bold;" class="' + data.titleRowClass + '">' +
                    columnsHtml +
                    '</div>' +
                    '</div>'
                );
        },
        html: function(data) {
            return (
                '<div class="always-fixed">' +
                    '<div class="buttons">' +
                    '<input class ="hnisi-btn selectbox-btn" type="button" id="'+self.$input.context.id+'_okay_btn" value="OK" />' +
                    '</div>' +
                    '</div>'
                );
        }

    }, options);

    self.settings.onItemAdd = function(value, $item){
        // save to rightContent
        self.$selectbox.refreshSelectBox();

        // update $control_input style when item added
        var $info = $(self.render('info',self.options[value]));
        if(self.items.length==1){
            this.$control.prepend($info);
        }else{
            $(self.$control.children('.info')[0]).html($($info).html());
        }
    };
    self.settings.onItemRemove = function(value, $item){
        // remove from rightContent
        self.$selectbox.refreshSelectBox();

        // update $control_input style when item removed
        var $info = $(self.render('info',self.options[value]));
        if(self.items.length === 0){
            // remove
            $(self.$control.children('.info')[0]).remove();
        }else{
            // update
            $(self.$control.children('.info')[0]).html($($info).html());
        }
    };


    self.settings.render={
        // render option as selectbox style
        option : function(item,escape){
            if(options.columns){
                var rowHtml = "";
                $.each(options.columns,function(i){
                    var width = "";
                    if(options.columns[i].width){
                        width = 'width:'+options.columns[i].width;
                    }
                    rowHtml += '<li class="'+options.labelClass+'" style="'+width+'">' +item[options.columns[i].field] + '</li>';
                });
            }
            return '<ul class="'+options.titleRowClass+'">' +
                rowHtml+
                '</ul>';
        },
        // render selected information as selectbox style
        info : function(data,escape){
            return '<div class="info">'+self.items.length+' selected</div>';
        }
    };

    self.setup = (function() {
        var original = self.setup;
        return function() {
            original.apply(self, arguments);

            // multiple column header
            self.$selectbox_header = $(options.headerHtml(options));
            if(self.$toolbar_header){ // generate by plugin[toolbar_header]
                self.$toolbar_header.append(self.$dropdown_header);
            }else{
                self.$dropdown.prepend(self.$dropdown_header);
            }

            self.$dropdown.leftContent = self.$dropdown.wrapInner('<div style="float: left;width:60%"></div>');
            self.$dropdown.rightContent = $('<div style="float:right;width: 40%;"></div>');
            self.$dropdown.leftContent.append(self.$dropdown.rightContent);

            self.$dropdown.on('click', '.remove-icon', function(e) {
                e.preventDefault();
                if (self.isLocked) return;

                var $value = $(e.currentTarget).parent().children('.item').data('value');
                self.removeItem($value);
            });
        };
    })();
});