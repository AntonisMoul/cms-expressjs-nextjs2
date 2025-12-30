<x-core::custom-template id="_render_custom_field_field_group_template">
    <div class="widget meta-boxes mb-3">
        <div class="widget-title">
            <h4><span>__title__</span></h4>
        </div>
        <div class="box-body meta-boxes-body widget-body"></div>
    </div>
</x-core::custom-template>

<x-core::custom-template id="_render_custom_field_global_skeleton_template">
    <div class="meta-box field-__type__">
        <div class="title">
            <label class="form-label">__title__</label>
        </div>
        <div class="meta-box-wrap"></div>
        <small class="form-hint mt-1 text-truncate __hide_instructions__">__instructions__</small>
    </div>
</x-core::custom-template>

<x-core::custom-template id="_render_custom_field_text_template">
    <input
        type="text"
        value="__value__"
        placeholder="__placeholderText__"
        class="form-control"
    >
</x-core::custom-template>

<x-core::custom-template id="_render_custom_field_number_template">
    <input
        type="number"
        value="__value__"
        placeholder="__placeholderText__"
        class="form-control"
    >
</x-core::custom-template>

<x-core::custom-template id="_render_custom_field_email_template">
    <input
        type="email"
        value="__value__"
        placeholder="__placeholderText__"
        class="form-control"
    >
</x-core::custom-template>

<x-core::custom-template id="_render_custom_field_password_template">
    <input
        type="password"
        value="__value__"
        placeholder="__placeholderText__"
        class="form-control"
    >
</x-core::custom-template>

<x-core::custom-template id="_render_custom_field_url_template">
    <input
        type="url"
        value="__value__"
        placeholder="__placeholderText__"
        class="form-control"
    >
</x-core::custom-template>

<x-core::custom-template id="_render_custom_field_date_template">
    <div class="datepicker">
        <input
            type="text"
            value="__value__"
            data-date-format="__dateFormat__"
            data-input
            readonly="readonly"
            class="form-control"
        >
    </div>
</x-core::custom-template>

<x-core::custom-template id="_render_custom_field_datetime_template">
    <div class="datepicker">
        <input
            type="text"
            value="__value__"
            data-date-format="__dateFormat__ __timeFormat__"
            data-options='{"enableTime": true}'
            data-input
            readonly="readonly"
            class="form-control"
        >
    </div>
</x-core::custom-template>

<x-core::custom-template id="_render_custom_field_time_template">
    <div class="input-group">
        <input
            type="text"
            value="__value__"
            class="form-control time-picker timepicker timepicker-24"
        >
        <button
            type="button"
            class="btn btn-outline-secondary"
        >
            <x-core::icon
                name="ti ti-clock"
                class="me-0"
            />
        </button>
    </div>
</x-core::custom-template>

<x-core::custom-template id="_render_custom_field_color_template">
    <input
        type="text"
        value="__value__"
        class="form-control"
        data-bb-color-picker
    />
</x-core::custom-template>

<x-core::custom-template id="_render_custom_field_textarea_template">
    <textarea
        rows="__rows__"
        placeholder="__placeholderText__"
        class="form-control"
    >__value__</textarea>
</x-core::custom-template>

<x-core::custom-template id="_render_custom_field_checkbox_template">
    <div class="clearfix">
        <label class="form-check">
            <input
                type="checkbox"
                class="form-check-input"
                __checked__
                value="__value__"
            >
            <span></span>
            __title__
        </label>
    </div>
</x-core::custom-template>

<x-core::custom-template id="_render_custom_field_radio_template">
    <div class="clearfix">
        <label class="form-check">
            <input
                type="radio"
                __checked__
                class="form-check-input"
                name="_custom_field_radio_box__id__"
                value="__value__"
            >
            <span></span>
            __title__
        </label>
    </div>
</x-core::custom-template>

<x-core::custom-template id="_render_custom_field_select_template">
    <select class="form-select">
        <option value=""></option>
    </select>
</x-core::custom-template>

<x-core::custom-template id="_render_custom_field_image_template">
    <div class="select-media-box">
        @include('core/base::forms.partials.image', [
            'name' => null,
            'value' => '__value__',
            'image' => '__image__',
            'attributes' => [],
        ])
    </div>
</x-core::custom-template>

<x-core::custom-template id="_render_custom_field_file_template">
    <div class="select-media-box">
        @include('core/base::forms.partials.file', [
            'name' => null,
            'value' => '__value__',
            'url' => '__url__',
            'attributes' => [],
        ])
    </div>
</x-core::custom-template>

<x-core::custom-template id="_render_custom_field_wysiswg_template">
    <textarea
        class="form-control wysiwyg-editor"
        rows="3"
    >__value__</textarea>
</x-core::custom-template>

<x-core::custom-template id="_render_custom_field_repeater_template">
    <div class="lcf-repeater">
        <ul class="sortable-wrapper field-group-items"></ul>
        <a
            href="#"
            class="repeater-add-new-field mt10 btn btn-info"
        ></a>
    </div>
</x-core::custom-template>

<x-core::custom-template id="_render_custom_field_repeater_item_template">
    <li
        class="ui-sortable-handle"
        data-position="__position__"
    >
        <a
            href="#"
            class="remove-field-line"
            title="{{ trans('plugins/custom-field::base.remove_this_line') }}"
        ><span>&nbsp;</span></a>
        <a
            href="#"
            class="collapse-field-line"
            title="{{ trans('plugins/custom-field::base.collapse_this_line') }}"
        >
            <x-core::icon name="ti ti-menu-2" />
        </a>
        <div class="clearfix col-12 field-line-wrapper">
            <ul class="field-group"></ul>
        </div>
        <div class="clearfix"></div>
    </li>
</x-core::custom-template>

<x-core::custom-template id="_render_custom_field_repeater_line_template">
    <li>
        <div class="col-3 repeater-item-helper">
            <div class="field-label form-label">__title__</div>
        </div>
        <div class="col-9 repeater-item-input"></div>
        <div class="col-12">
            <small
                class="field-instructions form-hint mt-1 text-truncate __hide_instructions__">__instructions__</small>
        </div>
        <div class="clearfix"></div>
    </li>
</x-core::custom-template>
