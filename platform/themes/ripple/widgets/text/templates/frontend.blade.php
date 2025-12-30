@if ($config['name'] || $config['content'])
    <div class="widget widget--transparent widget__footer widget__about">
        @if ($config['name'])
            <div class="widget__header">
                <h3 class="widget__title">{!! BaseHelper::clean($config['name']) !!}</h3>
            </div>
        @endif

        @if ($config['content'])
            <div class="widget__content">
                <div>{!! BaseHelper::clean(shortcode()->compile($config['content'])) !!}</div>
            </div>
        @endif
    </div>
@endif
