(function ($) {
    "use strict";
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $(document).ready(function () {
        // without image upload
        tinymce.init({
            selector: ".summernote",
            menubar: false,
            plugins:
                "anchor autolink charmap link lists searchreplace visualblocks wordcount table",
            toolbar:
                "blocks fontsize | bold italic underline | link | align lineheight | numlist bullist | table",
            tinycomments_mode: "embedded",
            tinycomments_author: "Author name",
            mergetags_list: [
                {
                    value: "First.Name",
                    title: "First Name",
                },
                {
                    value: "Email",
                    title: "Email",
                },
            ],
        });
        // with image upload
        var removedImages = [];
        tinymce.init({
            selector: ".summernote-img",
            plugins:
                "anchor autolink charmap link image lists searchreplace visualblocks fullscreen table",
            toolbar:
                "blocks fontsize  | bold italic underline | link| image | alignleft aligncenter alignright alignjustify lineheight | numlist bullist",
            menubar: false,
            tinycomments_mode: "embedded",
            tinycomments_author: "Author name",
            mergetags_list: [
                {
                    value: "First.Name",
                    title: "First Name",
                },
                {
                    value: "Email",
                    title: "Email",
                },
            ],
            setup: function (editor) {
                let previousContent = "";
                editor.on("init", function () {
                    previousContent = editor.getContent(); // Store the initial content
                });

                // Handle content changes
                editor.on("NodeChange", function (e) {
                    var currentContent = editor.getContent();

                    // Compare the previous content with the current content to detect if an image was removed
                    if (previousContent !== currentContent) {
                        // Check for removed images by comparing previousContent and currentContent
                        var previousImages = $(previousContent).find("img");
                        var currentImages = $(currentContent).find("img");

                        previousImages.each(function (index, img) {
                            var src = $(img).attr("src");

                            // If an image in the previous content is not in the current content, it was removed
                            if (
                                currentImages.filter(`[src="${src}"]`)
                                    .length === 0
                            ) {
                                // Image removed, handle deletion
                                $.ajax({
                                    type: "DELETE",
                                    url:
                                        base_url +
                                        "/admin/tinymce-delete-image",
                                    data: { file_path: src },
                                    success: function (response) {},
                                    error: function (xhr) {},
                                });
                            }
                        });

                        // Update previous content
                        previousContent = currentContent;
                    }
                });
            },
            image_class_list: [{ title: "img-fluid", value: "img-fluid" }],
            image_title: true,
            automatic_uploads: true,
            images_upload_url: base_url + "/admin/tinymce-upload-image",
            file_picker_types: "image",
            file_picker_callback: function (cb, value, meta) {
                var input = document.createElement("input");
                input.setAttribute("type", "file");
                input.setAttribute("accept", "image/*");
                input.onchange = function () {
                    var file = this.files[0];

                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function () {
                        var id = "blobid" + new Date().getTime();
                        var blobCache =
                            tinymce.activeEditor.editorUpload.blobCache;
                        var base64 = reader.result.split(",")[1];
                        var blobInfo = blobCache.create(id, file, base64);
                        blobCache.add(blobInfo);
                        cb(blobInfo.blobUri(), { title: file.name });
                    };
                };
                input.click();
            },
        });

        $(".select2").select2();
        $(".sub_cat_one").select2();
        $(".tags").tagify();
        $(".datetimepicker_mask").datetimepicker({
            format: "Y-m-d H:i",
        });

        $(".custom-icon-picker").iconpicker({
            templates: {
                popover:
                    '<div class="iconpicker-popover popover"><div class="arrow"></div>' +
                    '<div class="popover-title"></div><div class="popover-content"></div></div>',
                footer: '<div class="popover-footer"></div>',
                buttons:
                    '<button class="iconpicker-btn iconpicker-btn-cancel btn btn-default btn-sm">Cancel</button>' +
                    ' <button class="iconpicker-btn iconpicker-btn-accept btn btn-primary btn-sm">Accept</button>',
                search: '<input type="search" class="form-control iconpicker-search" placeholder="Type to filter" />',
                iconpicker:
                    '<div class="iconpicker"><div class="iconpicker-items"></div></div>',
                iconpickerItem:
                    '<a role="button" href="javascript:;" class="iconpicker-item"><i></i></a>',
            },
        });
        $(".datepicker").datepicker({
            format: "yyyy-mm-dd",
            startDate: "-Infinity",
        });
        $(".datepicker-two").datepicker({
            format: "yyyy-mm-dd",
        });

        $(".clockpicker").clockpicker();
        $('input[data-toggle="toggle"]').bootstrapToggle();

        /* Admin menu search method start */
        const inputSelector = "#search_menu";
        const listSelector = "#admin_menu_list";
        const notFoundSelector = ".not-found-message";

        function filterMenuList() {
            const query = $(inputSelector).val().toLowerCase();
            let hasResults = false;

            $(listSelector + " a").each(function () {
                const areaName = $(this).text().toLowerCase();
                const shouldShow = areaName.includes(query);
                $(this).toggleClass("d-none", !shouldShow);
                if (shouldShow) {
                    hasResults = true;
                }
            });

            // Show or hide the "Not Found" message based on search results
            if (hasResults) {
                $(notFoundSelector).addClass("d-none");
            } else {
                $(notFoundSelector).removeClass("d-none");
            }
        }
        $(inputSelector).on("input focus", function () {
            filterMenuList();
            $(listSelector).removeClass("d-none");
        });

        $(document).on("click", function (e) {
            if (
                !$(e.target).closest(inputSelector).length &&
                !$(e.target).closest(listSelector).length
            ) {
                $(listSelector).addClass("d-none");
            }
        });

        $(document).on("click", ".search-menu-item", function (e) {
            const activeTab = $(this).attr("data-active-tab");
            if (activeTab) {
                localStorage.setItem("activeTab", activeTab);
            }
        });
        /* Admin menu search method end */

        //Translate button text update
        var selectedTranslation = $('#selected-language').text();
        var btnText = `${translate_to} ${selectedTranslation}`;
        $('#translate-btn').text(btnText);

        $(document).on("click", ".delete-btn", function (e) {
            e.preventDefault();
            var deleteLink = $(this).prop("href");
            var modalId = $(this).data("modal");
            if (deleteLink) {
                $(modalId).find('form').attr("action", deleteLink);
                $(modalId).modal('show');
            }
        });

        $(document).on("click", ".logout-button", function (e) {
            e.preventDefault();
            $('#admin-logout-form').submit();
        });
        $(document).on("change", ".change-status", function (e) {
            e.preventDefault();
            var url = $(this).data("href");
            $.ajax({
                type: "put",
                url: url,
                success: function(response) {
                    if (response.success) {
                        toastr.success(response.message);
                    } else {
                        toastr.warning(response.message);
                    }
                },
                error: function(err) {
                    if (err.responseJSON && err.responseJSON.message) {
                        toastr.error(err.responseJSON.message);
                    } else {
                        toastr.error(basic_error_message );
                    }
                }
            });
        });
        $(document).on("change", ".on-change-submit", function (e) {
            $(this).submit();
        });
        $(document).on("change", ".on-change-submit-filter_form", function (e) {
            $('#search_filter_form').submit();
        });
        $(document).on("click", ".activate-default-theme", function (e) {
            var form = $(this).data('form-id');
            $(form).submit();
        });
    });
})(jQuery);

//Tab active setup locally
function activeTabSetupLocally(tabContainerId) {
    "use strict";
    var activeTab = localStorage.getItem(tabContainerId + "ActiveTab");
    if (activeTab) {
        $("#" + tabContainerId + ' a[href="#' + activeTab + '"]').tab("show");
    } else {
        $("#" + tabContainerId + " a:first").tab("show");
    }

    $("#" + tabContainerId + ' a[data-bs-toggle="tab"]').on(
        "shown.bs.tab",
        function (e) {
            localStorage.setItem(
                tabContainerId + "ActiveTab",
                $(e.target).attr("href").substring(1)
            );
        }
    );
}
/**
 * Translates all inputs one by one to the specified language.
 *
 * @param {string} lang - The language to translate the inputs to.
 */
function translateAllTo(lang) {
    if (isDemo == "demo") {
        toastr.error(demo_mode_error);
        return;
    }

    $("#translate-btn").prop("disabled", true);
    $("#update-btn").prop("disabled", true);

    var inputs = $('[data-translate="true"]').toArray();

    var isTranslatingInputs = true;

    function translateOneByOne(inputs, index = 0) {
        if (index >= inputs.length) {
            if (isTranslatingInputs) {
                isTranslatingInputs = false;
                translateAllTextarea();
            }
            $("#translate-btn").prop("disabled", false);
            $("#update-btn").prop("disabled", false);
            return;
        }

        var $input = $(inputs[index]);
        var inputValue = $input.val();

        if (inputValue) {
            $.ajax({
                url: `${base_url}/admin/languages/update-single`,
                type: "POST",
                data: {
                    lang: lang,
                    text: inputValue,
                },
                dataType: "json",
                beforeSend: function () {
                    $input.prop("disabled", true);
                    iziToast.show({
                        timeout: false,
                        close: true,
                        theme: "dark",
                        icon: "loader",
                        iconUrl:
                            "https://hub.izmirnic.com/Files/Images/loading.gif",
                        title: translation_processing,
                        position: "center",
                    });
                },
                success: function (response) {
                    $input.val(response);

                    // check input is tinymce and set content
                    var classesToCheck = ["summernote", "summernote-img"];
                    if (classesToCheck.some(cls => $input.hasClass(cls))) {
                        var inputId = $input.attr("id");
                        tinymce.get(inputId).setContent(response);
                    }

                    $input.prop("disabled", false);
                    iziToast.destroy();
                    toastr.success(translation_success);
                    translateOneByOne(inputs, index + 1);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    iziToast.destroy();
                    toastr.error("Error", errorThrown);
                },
            });
        } else {
            translateOneByOne(inputs, index + 1);
        }
    }

    function translateAllTextarea() {
        var inputs = $('textarea[data-translate="true"]').toArray();
        if (inputs.length === 0) {
            return;
        }
        translateOneByOne(inputs);
    }

    translateOneByOne(inputs);
}
// addon side menu hide and show
document.addEventListener("DOMContentLoaded", function () {
    const addonMenu = document.querySelector(".addon_menu");
    const addonSideMenu = document.querySelector("#addon_sidemenu");

    if (addonMenu && addonSideMenu) {
        if (addonMenu.querySelectorAll("li").length === 0) {
            addonSideMenu.style.display = "none";
        }
    }
});

// auto active addon menu when li have class active
document.addEventListener('DOMContentLoaded', () => {
    const addonMenu = document.querySelector('.addon_menu');
    const addonSidemenu = document.getElementById('addon_sidemenu');

    if (addonMenu && addonMenu.querySelector('li.active')) {
        addonSidemenu.classList.add('active', 'show');
    }
});