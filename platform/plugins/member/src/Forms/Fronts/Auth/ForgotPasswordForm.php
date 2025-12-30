<?php

namespace Botble\Member\Forms\Fronts\Auth;

use Botble\Base\Facades\BaseHelper;
use Botble\Base\Forms\Fields\EmailField;
use Botble\Base\Forms\Fields\HtmlField;
use Botble\Member\Forms\Fronts\Auth\FieldOptions\EmailFieldOption;
use Botble\Member\Http\Requests\Fronts\Auth\ForgotPasswordRequest;

class ForgotPasswordForm extends AuthForm
{
    public static function formTitle(): string
    {
        return trans('plugins/member::member.form.forgot_password_title');
    }

    public function setup(): void
    {
        parent::setup();

        $this
            ->setUrl(route('public.member.password.email'))
            ->setValidatorClass(ForgotPasswordRequest::class)
            ->icon('ti ti-lock-question')
            ->heading(trans('plugins/member::dashboard.forgot_password_title'))
            ->description(trans('plugins/member::dashboard.lost_password_description'))
            ->add(
                'email',
                EmailField::class,
                EmailFieldOption::make()
                    ->label(trans('plugins/member::dashboard.email'))
                    ->placeholder(trans('plugins/member::dashboard.email_address'))
                    ->icon('ti ti-mail')
            )
            ->submitButton(sprintf('%s %s', trans('plugins/member::dashboard.send_password_reset_link'), BaseHelper::renderIcon('ti ti-arrow-narrow-right', null, ['class' => 'ms-1'])))
            ->add('back_to_login', HtmlField::class, [
                'html' => sprintf(
                    '<div class="mt-3 text-center"><a href="%s" class="text-decoration-underline">%s</a></div>',
                    route('public.member.login'),
                    trans('plugins/member::dashboard.back-to-login')
                ),
            ]);
    }
}
