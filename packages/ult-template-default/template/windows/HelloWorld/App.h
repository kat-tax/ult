#pragma once

#include "App.xaml.g.h"



namespace winrt::HelloWorld::implementation
{
    struct App : AppT<App>
    {
        App() noexcept;
    };
} // namespace winrt::HelloWorld::implementation


