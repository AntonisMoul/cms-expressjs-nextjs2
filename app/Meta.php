<?php

namespace App;

class Meta
{
    protected static $meta = [];
    protected $favicon = '';//

    public static function addMeta($name, $content)
    {
        static::$meta[$name] = $content;
    }

    public static function render()
    {
        $favicon = get_image_url(theme_option('favicon')) ?? '/vendor/core/core/base/images/favicon.png';

        $html = '<link rel="icon" type="image/x-icon" href="' . $favicon .'">';

        foreach (static::$meta as $name => $content) {

            if(!$content){
                continue;
            }

            if($name == 'title'){
                $html .= '<title>' . $content . '</title>'.PHP_EOL;
            }else{
                $html .= '<meta name="'.$name.'" content="'.$content.'" />'.PHP_EOL;

            }
        }

        if(isset(static::$meta['title'])){
            $html .= '<meta property="og:title" content="' .static::$meta['title'] . '" />'.PHP_EOL;

        }
        if(isset(static::$meta['description'])){
            $html .= '<meta property="og:description" content="' . static::$meta['description'] . '" />'.PHP_EOL;

        }



        if(isset(static::$meta['image'])){
            $html .= '<meta property="og:image" content="' . static::$meta['image'] . '">'.PHP_EOL;
        }else{
            $html .= '<meta property="og:image" content="' . $favicon . '">'.PHP_EOL;
        }


        return $html;
    }

    public static function cleanup()
    {
        static::$meta = [];
    }
}
