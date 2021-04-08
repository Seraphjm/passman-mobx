import React from 'react';

if (process.env.NODE_ENV === 'development') {
    require('@welldone-software/why-did-you-render')(React, {
        trackAllPureComponents: true,
        trackHooks: true,
    });
}
