<?php

namespace Botble\Member\Forms\Fronts\Auth;

use Botble\Base\Forms\Fields\EmailField;
use Botble\Base\Forms\Fields\HtmlField;
use Botble\Base\Forms\Fields\PasswordField;
use Botble\Member\Forms\Fronts\Auth\FieldOptions\EmailFieldOption;
use Botble\Member\Forms\Fronts\Auth\FieldOptions\TextFieldOption;
use Botble\Member\Http\Requests\Fronts\Auth\ResetPasswordRequest;

class ResetPasswordForm extends AuthForm
{
    public static function formTitle(): string
    {
        return trans('plugins/member::member.form.reset_password_title');
    }

    public function setup(): void
    {
        parent::setup();

        $this
            ->setUrl(route('public.member.password.update'))
            ->icon('ti ti-lock')
            ->setValidatorClass(ResetPasswordRequest::class)
            ->heading(trans('plugins/member::dashboard.reset-password-title'))
            ->add(
                'token',
                'hidden',
                TextFieldOption::make()
                    ->value($this->request->route('token'))
            )
            ->add(
                'email',
                EmailField::class,
                EmailFieldOption::make()
                    ->label(trans('plugins/member::dashboard.email_address'))
                    ->value($this->request->input('email'))
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
            ->submitButton(trans('plugins/member::dashboard.reset-password-cta'))
            ->add('back_to_login', HtmlField::class, [
                'html' => sprintf(
                    '<div class="mt-3 text-center"><a href="%s" class="text-decoration-underline">%s</a></div>',
                    route('public.member.login'),
                    trans('plugins/member::dashboard.back-to-login')
                ),
            ]);
    }
}
