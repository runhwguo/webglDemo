#!/usr/bin/env python3

"""
修改文件，自动发布 ./pymonitor.py, 默认app.py为启动文件
"""

import os
import subprocess
import sys
import time

from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer

__author__ = 'Runhwguo'


def log(s):
    print('[Monitor] %s' % s)


class MyFileSystemEventHandler(FileSystemEventHandler):
    def __init__(self, fn):
        super(MyFileSystemEventHandler, self).__init__()
        self.restart = fn

    def on_any_event(self, event):
        if event.src_path.endswith('.py') or event.src_path.endswith('.html') or event.src_path.endswith(
                '.js') or event.src_path.endswith('.css'):
            log('Python source file changed: %s' % event.src_path)
            self.restart()


command = None
process = None


def kill_process():
    global process
    if process:
        log('Kill process [%s]...' % process.pid)
        process.kill()
        process.wait()
        log('Process ended with code %s.' % process.returncode)
        process = None


def start_process():
    global process, command
    log('Start process %s...' % ' '.join(command))
    process = subprocess.Popen(command, stdin=sys.stdin, stdout=sys.stdout, stderr=sys.stderr)


def restart_process():
    kill_process()
    start_process()


def start_watch():
    observer = Observer()
    observer.schedule(MyFileSystemEventHandler(restart_process), path, True)
    observer.start()
    log('Watching directory %s...' % path)
    start_process()
    try:
        while True:
            time.sleep(0.5)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()


if __name__ == '__main__':
    argv = sys.argv[1:]
    if not argv:
        argv.insert(0, './app.py')
    command = argv
    path = os.path.abspath('.')
    start_watch()
