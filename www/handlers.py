#!/usr/bin/env python3

""" url handlers """

import logging

from coroweb import get

__author__ = 'RunhwGuo'

logging.basicConfig(level=1)


@get('/quanjing')
async def quanjing(request):
    return {
        '__template__': 'index.html',
    }


@get('/clock')
async def clock(request):
    return {
        '__template__': 'clock.html',
    }


@get('/vr_grass')
async def vr_grass(request):
    return {
        '__template__': 'vr_grass.html',
    }
