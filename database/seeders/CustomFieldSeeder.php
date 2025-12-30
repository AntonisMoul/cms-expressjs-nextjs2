<?php

namespace Database\Seeders;

use Botble\Base\Enums\BaseStatusEnum;
use Botble\Base\Supports\BaseSeeder;
use Botble\CustomField\Models\FieldGroup;
use Botble\CustomField\Models\FieldItem;

class CustomFieldSeeder extends BaseSeeder
{
    public function run(): void
    {
        FieldGroup::query()->truncate();
        FieldItem::query()->truncate();

        $fieldGroups = [
            [
                'title' => 'Post Additional Information',
                'rules' => json_encode([
                    [
                        [
                            'name' => 'model_name',
                            'type' => '==',
                            'value' => 'Botble\Blog\Models\Post',
                        ],
                    ],
                ]),
                'order' => 0,
                'status' => BaseStatusEnum::PUBLISHED,
                'created_by' => 1,
                'updated_by' => 1,
            ],
            [
                'title' => 'Page Custom Fields',
                'rules' => json_encode([
                    [
                        [
                            'name' => 'model_name',
                            'type' => '==',
                            'value' => 'Botble\Page\Models\Page',
                        ],
                    ],
                ]),
                'order' => 1,
                'status' => BaseStatusEnum::PUBLISHED,
                'created_by' => 1,
                'updated_by' => 1,
            ],
        ];

        foreach ($fieldGroups as $index => $group) {
            $fieldGroup = FieldGroup::query()->create($group);

            if ($index === 0) {
                // Post Additional Information field items
                $fieldItems = [
                    [
                        'field_group_id' => $fieldGroup->id,
                        'parent_id' => null,
                        'order' => 0,
                        'title' => 'Post Options',
                        'slug' => 'post_options',
                        'type' => 'checkbox',
                        'instructions' => 'Select post display options',
                        'options' => json_encode([
                            'selectChoices' => "featured:Featured post\nsticky:Sticky post\nshow_author:Show author\nallow_comments:Allow comments\nshow_date:Show publish date",
                        ]),
                    ],
                    [
                        'field_group_id' => $fieldGroup->id,
                        'parent_id' => null,
                        'order' => 1,
                        'title' => 'Reading Time',
                        'slug' => 'reading_time',
                        'type' => 'number',
                        'instructions' => 'Estimated reading time in minutes',
                        'options' => json_encode([
                            'placeholderText' => '5',
                            'defaultValue' => '5',
                            'min' => 1,
                            'max' => 60,
                        ]),
                    ],
                    [
                        'field_group_id' => $fieldGroup->id,
                        'parent_id' => null,
                        'order' => 2,
                        'title' => 'External Source',
                        'slug' => 'external_source',
                        'type' => 'text',
                        'instructions' => 'Link to external source or reference',
                        'options' => json_encode([
                            'placeholderText' => 'https://example.com/article',
                        ]),
                    ],
                    [
                        'field_group_id' => $fieldGroup->id,
                        'parent_id' => null,
                        'order' => 3,
                        'title' => 'Post Type',
                        'slug' => 'post_type',
                        'type' => 'select',
                        'instructions' => 'Select the type of post',
                        'options' => json_encode([
                            'selectChoices' => "article:Article\nnews:News\ntutorial:Tutorial\nreview:Review",
                            'defaultValue' => 'article',
                        ]),
                    ],
                    [
                        'field_group_id' => $fieldGroup->id,
                        'parent_id' => null,
                        'order' => 4,
                        'title' => 'Custom Excerpt',
                        'slug' => 'custom_excerpt',
                        'type' => 'textarea',
                        'instructions' => 'Custom excerpt for social media sharing',
                        'options' => json_encode([
                            'placeholderText' => 'Enter a brief summary...',
                            'rows' => 3,
                        ]),
                    ],
                    [
                        'field_group_id' => $fieldGroup->id,
                        'parent_id' => null,
                        'order' => 5,
                        'title' => 'Sponsored By',
                        'slug' => 'sponsored_by',
                        'type' => 'text',
                        'instructions' => 'Sponsor name (if applicable)',
                        'options' => json_encode([
                            'placeholderText' => 'Company name',
                        ]),
                    ],
                ];

                foreach ($fieldItems as $item) {
                    FieldItem::query()->create($item);
                }
            }

            if ($index === 1) {
                // Page Custom Fields field items
                $fieldItems = [
                    [
                        'field_group_id' => $fieldGroup->id,
                        'parent_id' => null,
                        'order' => 0,
                        'title' => 'Hero Banner',
                        'slug' => 'hero_banner',
                        'type' => 'image',
                        'instructions' => 'Upload a hero banner image for this page',
                        'options' => json_encode([
                            'allow_thumb' => true,
                        ]),
                    ],
                    [
                        'field_group_id' => $fieldGroup->id,
                        'parent_id' => null,
                        'order' => 1,
                        'title' => 'Page Subtitle',
                        'slug' => 'page_subtitle',
                        'type' => 'text',
                        'instructions' => 'Add a subtitle or tagline for this page',
                        'options' => json_encode([
                            'placeholderText' => 'Enter page subtitle',
                        ]),
                    ],
                    [
                        'field_group_id' => $fieldGroup->id,
                        'parent_id' => null,
                        'order' => 2,
                        'title' => 'Call to Action',
                        'slug' => 'cta_button',
                        'type' => 'text',
                        'instructions' => 'Call to action button text',
                        'options' => json_encode([
                            'placeholderText' => 'Learn More',
                        ]),
                    ],
                    [
                        'field_group_id' => $fieldGroup->id,
                        'parent_id' => null,
                        'order' => 3,
                        'title' => 'CTA Link',
                        'slug' => 'cta_link',
                        'type' => 'text',
                        'instructions' => 'URL for the call to action button',
                        'options' => json_encode([
                            'placeholderText' => 'https://example.com/contact',
                        ]),
                    ],
                    [
                        'field_group_id' => $fieldGroup->id,
                        'parent_id' => null,
                        'order' => 4,
                        'title' => 'Page Layout',
                        'slug' => 'page_layout',
                        'type' => 'radio',
                        'instructions' => 'Select the page layout',
                        'options' => json_encode([
                            'selectChoices' => "default:Default Layout\nsidebar-left:Left Sidebar\nsidebar-right:Right Sidebar\nfull-width:Full Width",
                            'defaultValue' => 'default',
                        ]),
                    ],
                    [
                        'field_group_id' => $fieldGroup->id,
                        'parent_id' => null,
                        'order' => 5,
                        'title' => 'Page Settings',
                        'slug' => 'page_settings',
                        'type' => 'checkbox',
                        'instructions' => 'Select page display options',
                        'options' => json_encode([
                            'selectChoices' => "hide_title:Hide page title\nhide_breadcrumb:Hide breadcrumb\nhide_sidebar:Hide sidebar\nhide_footer:Hide footer",
                        ]),
                    ],
                ];

                foreach ($fieldItems as $item) {
                    FieldItem::query()->create($item);
                }
            }
        }

        $this->finished();
    }
}
