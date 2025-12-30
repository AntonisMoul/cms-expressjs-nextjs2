<h1>{{ trans('plugins/member::member.author') }}: {{ $author->name }}</h1>
<p>{!! BaseHelper::clean($author->description) !!}</p>

<h3>{{ trans('plugins/member::dashboard.posts_by_name', ['name' => $author->name]) }}:</h3>
@if ($posts->count() > 0)
    @foreach ($posts as $post)
        <article>
            <div>
                <a href="{{ $post->url }}"><img
                        src="{{ RvMedia::getImageUrl($post->image, null, false, RvMedia::getDefaultImage()) }}"
                        alt="{{ $post->name }}"
                    ></a>
            </div>
            <div>
                <header>
                    <h3><a href="{{ $post->url }}">{{ $post->name }}</a></h3>
                    <div>
                        <span>{{ $post->created_at->translatedFormat('M d, Y') }}</span><span>{{ $post->author->name }}</span>
                        -
                        {{ trans('plugins/member::dashboard.categories') }}:
                        @foreach ($post->categories as $category)
                            <a href="{{ $category->url }}">{{ $category->name }}</a>
                            @if (!$loop->last)
                                ,
                            @endif
                        @endforeach
                    </div>
                </header>
                <div>
                    <p>{{ $post->description }}</p>
                </div>
            </div>
        </article>
    @endforeach
    <div>
        {!! $posts->withQueryString()->links() !!}
    </div>
@else
    <p>{{ trans('plugins/member::dashboard.no_posts_found') }}</p>
@endif
