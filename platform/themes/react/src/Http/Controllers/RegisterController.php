<?php

namespace Theme\React\Http\Controllers;

use App\Traits\FlashMessages;
use Botble\ACL\Traits\RegistersUsers;
use Botble\Base\Http\Controllers\BaseController;
use Botble\Member\Forms\Fronts\Auth\RegisterForm;
use Botble\Member\Http\Requests\Fronts\Auth\RegisterRequest;
use Botble\Member\Models\Member;
use Botble\SeoHelper\Facades\SeoHelper;
use Botble\Theme\Facades\Theme;
use Carbon\Carbon;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class RegisterController extends BaseController
{
    use RegistersUsers, FlashMessages;

    protected string $redirectTo = '/';

    public function getRegister()
    {

        SeoHelper::setTitle(__('Register'));
        return Inertia::render('Register');
    }

    public function confirm(int|string $id, Request $request)
    {
        if (!URL::hasValidSignature($request)) {
            abort(404);
        }

        $member = Member::query()->findOrFail($id);

        $member->confirmed_at = Carbon::now();
        $member->save();

        $this->guard()->login($member);

        return $this
            ->httpResponse()
            ->setNextRoute('public.member.dashboard')
            ->setMessage(trans('plugins/member::member.confirmation_successful'));
    }

    protected function guard()
    {
        return auth('member');
    }

    public function resendConfirmation(Request $request)
    {
        /**
         * @var Member $member
         */
        $member = Member::query()->where('email', $request->input('email'))->first();

        if (!$member) {
            return $this
                ->httpResponse()
                ->setError()
                ->setMessage(__('Cannot find this account!'));
        }

        $this->sendConfirmationToUser($member);

        return $this
            ->httpResponse()
            ->setMessage(trans('plugins/member::member.confirmation_resent'));
    }

    protected function sendConfirmationToUser(Member $member)
    {
        // Notify the user
        $notificationConfig = config('plugins.member.general.notification');
        if ($notificationConfig) {
            $notification = app($notificationConfig);
            $member->notify($notification);
        }
    }

    public function register(RegisterRequest $request)
    {
        $member = Member::create($request->input());
        event(new Registered($member));

        if (setting('verify_account_email', config('plugins.member.general.verify_email'))) {
            $this->sendConfirmationToUser($member);

            $this->registered($request, $member);

            $this->flashMessage(trans('plugins/member::member.confirmation_info'));
            return to_route('public.index');
        }

        $member->confirmed_at = Carbon::now();
        $member->save();

        $this->guard()->login($member);

        $this->registered($request, $member);


        $this->flashMessage(trans('core/acl::auth.register.success'));
        return to_route('public.index');
    }

    protected function validator(array $data)
    {
        return Validator::make($data, (new RegisterRequest())->rules());
    }

    protected function create(array $data)
    {
        return Member::query()->create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
    }
}
