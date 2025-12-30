{{ header }}

<div class="bb-main-content">
    <table class="bb-box" cellpadding="0" cellspacing="0">
        <tbody>
            <tr>
                <td>
                    <table cellpadding="0" cellspacing="0">
                        <tbody>
                            <tr>
                                <td class="bb-content bb-pb-0" align="center">
                                    <table class="bb-icon bb-icon-lg bb-bg-blue" cellspacing="0" cellpadding="0">
                                        <tbody>
                                            <tr>
                                                <td valign="middle" align="center">
                                                    <img src="{{ 'hourglass' | icon_url }}" class="bb-va-middle" width="40" height="40" alt="Icon">
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <h1 class="bb-text-center bb-m-0 bb-mt-md">{{ 'plugins/member::member.email_templates.new_pending_post_title' | trans }}</h1>
                                </td>
                            </tr>
                            <tr>
                                <td class="bb-content">
                                    <p>{{ 'plugins/member::member.email_templates.new_pending_post_greeting' | trans }}</p>

                                    <p>{{ 'plugins/member::member.email_templates.new_pending_post_intro' | trans }}</p>

                                    <div class="bb-content-block">
                                        <h4>{{ 'plugins/member::member.email_templates.new_pending_post_details_title' | trans }}</h4>
                                        <table class="bb-table" cellspacing="0" cellpadding="0">
                                            <thead>
                                                <tr>
                                                    <th width="80px"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{{ 'plugins/member::member.email_templates.new_pending_post_author_label' | trans }}</td>
                                                    <td class="bb-font-strong bb-text-left">{{ post_author }}</td>
                                                </tr>
                                                <tr>
                                                    <td>{{ 'plugins/member::member.email_templates.new_pending_post_title_label' | trans }}</td>
                                                    <td class="bb-font-strong bb-text-left">{{ post_name }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <p>{{ 'plugins/member::member.email_templates.new_pending_post_action_needed' | trans }}</p>
                                </td>
                            </tr>
                            <tr>
                                <td class="bb-content bb-text-center bb-pt-0 bb-pb-xl" align="center">
                                    <table cellspacing="0" cellpadding="0">
                                        <tbody>
                                            <tr>
                                                <td align="center">
                                                    <table cellpadding="0" cellspacing="0" border="0" class="bb-bg-blue bb-rounded bb-w-auto">
                                                        <tbody>
                                                            <tr>
                                                                <td align="center" valign="top" class="lh-1">
                                                                    <a href="{{ post_url }}" class="bb-btn bb-bg-blue bb-border-blue">
                                                                        <span class="btn-span">{{ 'plugins/member::member.email_templates.new_pending_post_review_button' | trans }}</span>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <p class="bb-text-muted bb-mt-md">{{ 'plugins/member::member.email_templates.new_pending_post_footer_note' | trans }}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</div>

{{ footer }}
