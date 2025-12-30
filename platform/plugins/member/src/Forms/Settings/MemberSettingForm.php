<?php

namespace Botble\Member\Forms\Settings;

use Botble\Base\Forms\FieldOptions\MediaImageFieldOption;
use Botble\Base\Forms\FieldOptions\NumberFieldOption;
use Botble\Base\Forms\FieldOptions\OnOffFieldOption;
use Botble\Base\Forms\Fields\MediaImageField;
use Botble\Base\Forms\Fields\NumberField;
use Botble\Base\Forms\Fields\OnOffCheckboxField;
use Botble\Member\Http\Requests\Settings\MemberSettingRequest;
use Botble\Setting\Forms\SettingForm;

class MemberSettingForm extends SettingForm
{
    public function setup(): void
    {
        parent::setup();

        $this
            ->setSectionTitle(trans('plugins/member::settings.title'))
            ->setSectionDescription(trans('plugins/member::settings.description'))
            ->setValidatorClass(MemberSettingRequest::class)
            ->add(
                'member_enabled_login',
                OnOffCheckboxField::class,
                OnOffFieldOption::make()
                    ->label(trans('plugins/member::settings.enabled_login'))
                    ->helperText(trans('plugins/member::settings.enabled_login_helper'))
                    ->value($enabledLogin = setting('member_enabled_login', true))
            )
            ->addOpenCollapsible('member_enabled_login', '1', $enabledLogin)
            ->add(
                'member_enabled_registration',
                OnOffCheckboxField::class,
                OnOffFieldOption::make()
                    ->label(trans('plugins/member::settings.enabled_registration'))
                    ->helperText(trans('plugins/member::settings.enabled_registration_helper'))
                    ->value(setting('member_enabled_registration', true))
            )
            ->add(
                'verify_account_email',
                OnOffCheckboxField::class,
                OnOffFieldOption::make()
                    ->label(trans('plugins/member::settings.verify_account_email'))
                    ->value(setting('verify_account_email', false))
                    ->helperText(trans('plugins/member::settings.verify_account_email_helper'))
            )
            ->add(
                'member_verification_expire_minutes',
                NumberField::class,
                NumberFieldOption::make()
                    ->label(trans('plugins/member::settings.verification_expire_minutes'))
                    ->value(setting('member_verification_expire_minutes', config('plugins.member.general.verification_expire_minutes', 60)))
                    ->helperText(trans('plugins/member::settings.verification_expire_minutes_helper'))
                    ->min(1)
                    ->max(10080)
                    ->step(1)
            )
            ->addCloseCollapsible('member_enabled_login', '1')
            ->add(
                'member_enable_post_approval',
                OnOffCheckboxField::class,
                OnOffFieldOption::make()
                    ->label(trans('plugins/member::settings.enable_post_approval'))
                    ->helperText(trans('plugins/member::settings.enable_post_approval_helper'))
                    ->value(setting('member_enable_post_approval', true))
            )
            ->add(
                'member_default_avatar',
                MediaImageField::class,
                MediaImageFieldOption::make()
                    ->label(trans('plugins/member::settings.default_avatar'))
                    ->helperText(trans('plugins/member::settings.default_avatar_helper'))
                    ->value(setting('member_default_avatar'))
            )
            ->add(
                'member_show_terms_checkbox',
                OnOffCheckboxField::class,
                OnOffFieldOption::make()
                    ->label(trans('plugins/member::settings.show_terms_checkbox'))
                    ->helperText(trans('plugins/member::settings.show_terms_checkbox_helper'))
                    ->value(setting('member_show_terms_checkbox', true))
            );
    }
}
