<?php

namespace Botble\Member\Forms\Fronts\Auth;

use Botble\Base\Facades\BaseHelper;
use Botble\Base\Facades\Html;
use Botble\Base\Forms\FieldOptions\CheckboxFieldOption;
use Botble\Base\Forms\FieldOptions\HtmlFieldOption;
use Botble\Base\Forms\Fields\EmailField;
use Botble\Base\Forms\Fields\HtmlField;
use Botble\Base\Forms\Fields\OnOffCheckboxField;
use Botble\Base\Forms\Fields\PasswordField;
use Botble\Base\Forms\Fields\TextField;
use Botble\Member\Forms\Fronts\Auth\FieldOptions\EmailFieldOption;
use Botble\Member\Forms\Fronts\Auth\FieldOptions\TextFieldOption;
use Botble\Member\Http\Requests\Fronts\Auth\RegisterRequest;
use Botble\Member\Models\Member;

class RegisterForm extends AuthForm
{
    public static function formTitle(): string
    {
        return trans('plugins/member::member.form.register_title');
    }

    public function setup(): void
    {
        parent::setup();

        $this
            ->setUrl(route('public.member.register.post'))
            ->setValidatorClass(RegisterRequest::class)
            ->model(Member::class)
            ->icon('ti ti-user-plus')
            ->heading(trans('plugins/member::dashboard.register_an_account'))
            ->description(trans('plugins/member::dashboard.personal_data_description'))
            ->when(
                theme_option('register_background'),
                fn (AuthForm $form, string $background) => $form->banner($background)
            )
            ->add(
                'first_name',
                TextField::class,
                TextFieldOption::make()
                    ->label(trans('plugins/member::dashboard.first_name'))
                    ->placeholder(trans('plugins/member::dashboard.first_name'))
                    ->icon('ti ti-user')
            )
            ->add(
                'last_name',
                TextField::class,
                TextFieldOption::make()
                    ->label(trans('plugins/member::dashboard.last_name'))
                    ->placeholder(trans('plugins/member::dashboard.last_name'))
                    ->icon('ti ti-user')
            )
            ->add(
                'email',
                EmailField::class,
                EmailFieldOption::make()
                    ->label(trans('plugins/member::dashboard.email'))
                    ->placeholder(trans('plugins/member::dashboard.your_email'))
                    ->icon('ti ti-mail')
            )
            ->add(
                'password',
                PasswordField::class,
                TextFieldOption::make()
                    ->label(trans('plugins/member::dashboard.password'))
                    ->placeholder(trans('plugins/member::dashboard.password'))
                    ->icon('ti ti-lock')
            )
            ->add(
                'password_confirmation',
                PasswordField::class,
                TextFieldOption::make()
                    ->label(trans('plugins/member::dashboard.password-confirmation'))
                    ->placeholder(trans('plugins/member::dashboard.password-confirmation'))
                    ->icon('ti ti-lock')
            )
            ->when(
                setting('member_show_terms_checkbox', true),
                function (AuthForm $form): void {
                    $privacyPolicyUrl = theme_option('term_and_privacy_policy_url');

                    $form->add(
                        'agree_terms_and_policy',
                        OnOffCheckboxField::class,
                        CheckboxFieldOption::make()
                            ->when(
                                $privacyPolicyUrl,
                                function (CheckboxFieldOption $fieldOption, string $url): void {
                                    $fieldOption->label(trans('plugins/member::dashboard.agree_terms_link', ['link' => Html::link($url, trans('plugins/member::dashboard.terms_and_privacy_policy'), attributes: ['class' => 'text-decoration-underline', 'target' => '_blank'])]));
                                }
                            )
                            ->when(! $privacyPolicyUrl, function (CheckboxFieldOption $fieldOption): void {
                                $fieldOption->label(trans('plugins/member::dashboard.agree_terms'));
                            })
                    );
                }
            )
            ->submitButton(sprintf('%s %s', trans('plugins/member::dashboard.register-cta'), BaseHelper::renderIcon('ti ti-arrow-narrow-right', null, ['class' => 'ms-1'])))
            ->add(
                'login',
                HtmlField::class,
                HtmlFieldOption::make()
                    ->view('plugins/member::includes.login-link')
            )
            ->add('filters', HtmlField::class, [
                'html' => apply_filters(BASE_FILTER_AFTER_LOGIN_OR_REGISTER_FORM, null, Member::class),
            ]);
    }
}
