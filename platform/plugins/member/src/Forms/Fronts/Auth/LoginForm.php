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
use Botble\Member\Forms\Fronts\Auth\FieldOptions\EmailFieldOption;
use Botble\Member\Forms\Fronts\Auth\FieldOptions\TextFieldOption;
use Botble\Member\Http\Requests\Fronts\Auth\LoginRequest;
use Botble\Member\Models\Member;

class LoginForm extends AuthForm
{
    public static function formTitle(): string
    {
        return trans('plugins/member::member.form.login_title');
    }

    public function setup(): void
    {
        parent::setup();

        $this
            ->setUrl(route('public.member.login.post'))
            ->setValidatorClass(LoginRequest::class)
            ->icon('ti ti-lock')
            ->heading(trans('plugins/member::dashboard.login_to_account'))
            ->description(trans('plugins/member::dashboard.personal_data_description'))
            ->when(
                theme_option('login_background'),
                fn (AuthForm $form, string $background) => $form->banner($background)
            )
            ->add(
                'email',
                EmailField::class,
                EmailFieldOption::make()
                    ->label(trans('plugins/member::dashboard.email'))
                    ->placeholder(trans('plugins/member::dashboard.email_address'))
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
            ->add('openRow', HtmlField::class, [
                'html' => '<div class="row g-0 mb-3">',
            ])
            ->add(
                'remember',
                OnOffCheckboxField::class,
                CheckboxFieldOption::make()
                    ->label(trans('plugins/member::dashboard.remember-me'))
                    ->wrapperAttributes(['class' => 'col-6'])
            )
            ->add(
                'forgot_password',
                HtmlField::class,
                [
                    'html' => Html::link(route('public.member.password.request'), trans('plugins/member::dashboard.forgot_password_question'), attributes: ['class' => 'text-decoration-underline']),
                    'wrapper' => [
                        'class' => 'col-6 text-end',
                    ],
                ]
            )
            ->add('closeRow', HtmlField::class, [
                'html' => '</div>',
            ])
            ->submitButton(sprintf('%s %s', trans('plugins/member::dashboard.login-cta'), BaseHelper::renderIcon('ti ti-arrow-narrow-right', null, ['class' => 'ms-1'])))
            ->when(
                setting('member_enabled_registration', true),
                fn (AuthForm $form) => $form->add(
                    'register',
                    HtmlField::class,
                    HtmlFieldOption::make()
                        ->view('plugins/member::includes.register-link')
                )
            )
            ->add('filters', HtmlField::class, [
                'html' => apply_filters(BASE_FILTER_AFTER_LOGIN_OR_REGISTER_FORM, null, Member::class),
            ]);
    }
}
