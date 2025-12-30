<?php

namespace Theme\React\Http\Controllers;

use App\Meta;
use App\Traits\FlashMessages;
use Botble\ACL\Traits\AuthenticatesUsers;
use Botble\ACL\Traits\LogoutGuardTrait;
use Botble\Base\Facades\BaseHelper;
use Botble\Base\Http\Controllers\BaseController;
use Botble\Member\Http\Requests\Fronts\Auth\LoginRequest;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class LoginController extends BaseController
{
    use AuthenticatesUsers, LogoutGuardTrait, FlashMessages {
        AuthenticatesUsers::attemptLogin as baseAttemptLogin;
    }



    public function getLogin()
    {
        //dd(auth()->guard('member')->user());
        //Inertia::share('locale', app()->getLocale());
        if (Auth::guard('member')->check()) {
            return to_route('public.index');
        }

        $seo['title'] = theme_option('seo_title') && theme_option('seo_title') != ''  ? theme_option('seo_title') : null;
        $seo['description'] = theme_option('seo_description') && theme_option('seo_description') != '' ? theme_option('seo_description') : null;
        $seo['metaKeywords'] = null;

        Meta::addMeta('title', $seo['title']);
        Meta::addMeta('description', $seo['description']);
        Meta::addMeta('keywords',  $seo['metaKeywords']);

        return Inertia::render('Login');
    }

    public function login(LoginRequest $request)
    {
        //dd(app()->getLocale());
        //Inertia::share('locale', 'el');
        $this->validateLogin($request);

        // If the class is using the ThrottlesLogins trait, we can automatically throttle
        // the login attempts for this application. We'll key this by the username and
        // the IP address of the client making these requests into this application.
        if ($this->hasTooManyLoginAttempts($request)) {
            $this->fireLockoutEvent($request);

            $this->sendLockoutResponse($request);
        }

        if ($this->attemptLogin($request)) {
            $request->session()->regenerate();

            $this->clearLoginAttempts($request);

            $this->authenticated($request, $this->guard()->user());
            $this->flashMessage(trans('core/acl::auth.login.success'));
            return to_route('public.index');
        }

        // If the login attempt was unsuccessful we will increment the number of attempts
        // to log in and redirect the user back to the login form. Of course, when this
        // user surpasses their maximum number of attempts they will get locked out.
        $this->incrementLoginAttempts($request);

        $this->sendFailedLoginResponse();
    }

    protected function attemptLogin(Request $request)
    {
        if ($this->guard()->validate($this->credentials($request))) {
            $member = $this->guard()->getLastAttempted();

            if (setting(
                'verify_account_email',
                config('plugins.member.general.verify_email')
            ) && empty($member->confirmed_at)) {
                throw ValidationException::withMessages([
                    'confirmation' => [
                        trans('plugins/member::member.not_confirmed', [
                            'resend_link' => route('public.member.resend_confirmation', ['email' => $member->email]),
                        ]),
                    ],
                ]);
            }

            return $this->baseAttemptLogin($request);
        }

        return false;
    }

    protected function guard()
    {
        return auth('member');
    }

    public function logout(Request $request)
    {
        $activeGuards = 0;
        $this->guard()->logout();

        foreach (config('auth.guards', []) as $guard => $guardConfig) {
            if ($guardConfig['driver'] !== 'session') {
                continue;
            }
            if ($this->isActiveGuard($request, $guard)) {
                $activeGuards++;
            }
        }

        if (!$activeGuards) {
            $request->session()->flush();
            $request->session()->regenerate();
        }

        $this->loggedOut($request);

        return redirect()->to(BaseHelper::getHomepageUrl());
    }
}
