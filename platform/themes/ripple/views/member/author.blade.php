<div class="post-group post-group--single mb-50">
    <div class="post-group__header">
        <h3 class="post-group__title">{{ __('Author: :name', ['name' => $author->name]) }}</h3>
    </div>
    @if ($author->description)
        <div class="author-description mb-20">
            <p>{!! BaseHelper::clean($author->description) !!}</p>
        </div>
    @endif
</div>

@if ($posts->isNotEmpty())
    @foreach ($posts as $post)
        <article class="post post__horizontal mb-40 clearfix">
            <div class="post__thumbnail">
                {{ RvMedia::image($post->image, $post->name, 'medium') }}
                <a
                    class="post__overlay"
                    href="{{ $post->url }}"
                    title="{{ $post->name }}"
                ></a>
            </div>
            <div class="post__content-wrap">
                <header class="post__header">
                    <h3 class="post__title"><a
                            href="{{ $post->url }}"
                            title="{{ $post->name }}"
                        >{{ $post->name }}</a></h3>
                    <div class="post__meta">
                        {!! Theme::partial('blog.post-meta', ['post' => $post, 'showAuthorName' => false]) !!}
                    </div>
                </header>
                <div class="post__content">
                    <p data-number-line="4">{{ $post->description }}</p>
                </div>
            </div>
        </article>
    @endforeach
    <div class="page-pagination text-right">
        {!! $posts->withQueryString()->links() !!}
    </div>
@else
    <div class="alert alert-info">
        {!! BaseHelper::renderIcon('ti ti-info-circle') !!}
        {{ __('No posts found from this author yet.') }}
    </div>
@endif
