---
title: "Getting Started with the ZX Spectrum"
publishDate: "2025-04-22" # Renamed from date
platform: ["ZX Spectrum"] # Renamed from system and made into an array
summary: "The computer that started it all for me — let's get set up, run our first program, and start laying the groundwork for more."
description: "A step-by-step guide to setting up a ZX Spectrum development environment using the ZEsarUX emulator (via Docker or direct install) and running a simple BASIC program."
tags: ["Setup", "Emulator", "ZX Spectrum", "BASIC", "Docker"]
---

The ZX Spectrum 48K was the first computer that was truly mine. Not the family's. Not 
something I had to share at school. Mine. And I loved it.

It had a rubber keyboard, a wobbly power connector, and games that took several minutes 
to load from cassette tapes. If you were lucky, they loaded first try. If you weren't, 
you got to hear the screeching tones of failure and try again. That sound is forever 
etched into my brain.

But it was also a gateway to another world. One where, if you were willing to experiment 
(and type things in very carefully), you could make the screen change. You could make 
things happen. You could write your own games.

That's what we're going to do here — starting at the beginning.

---

## Step 1: Choosing an emulator

Unless you've got real hardware to hand (and if you do, I'm jealous), we'll need an 
emulator. There are a few great options, but I'm going to recommend [**ZEsarUX**](https://github.com/chernandezba/zesarux) 
because:

- It supports a wide range of Spectrum models, including the 128K and Next  
- It runs on macOS, Windows, and Linux  
- It includes a built-in debugger and even a BASIC interpreter  
- It's open source and under active development

We'll be using this throughout the series. Let's get it installed.

---

## Step 2: Running it with Docker

You _can_ install ZEsarUX directly on your computer — and if you'd prefer to do that, head 
to the [ZEsarUX releases page](https://github.com/chernandezba/zesarux/releases) and grab 
the version for your operating system.

But I'm going to run it using **[Docker](https://www.docker.com/)** instead.

If you've never used Docker before: think of it like a magic box. You tell it what you want 
to run, and it sets everything up inside a neat little container, without cluttering up your 
main system. It's perfect for fiddling with tools like this — especially when they're not 
super easy to install the old-fashioned way.

Here's the simplest way to run ZEsarUX from Docker (you'll need to have Docker installed 
already — [here's how](https://docs.docker.com/get-docker/)):

```sh
docker run --rm -it \
  -e DISPLAY=$DISPLAY \
  -v /tmp/.X11-unix:/tmp/.X11-unix \
  --device /dev/snd \
  zesarux/zesarux
```

If that works — great! You'll see the emulator launch in a separate window.

If not, don't worry. Depending on your system, you might need to do a little setup to make 
graphics and sound work. On macOS, for example, you'll need [**XQuartz**](https://www.xquartz.org/) 
installed so Docker can display windows. On Windows, it's a little more fiddly, but I'll walk 
through the setup in a follow-up post.

In the meantime, if this feels too technical, feel free to install ZEsarUX directly instead — 
we'll be using the same features either way.

---

## Step 3: Writing your first program

Let's keep it simple. We're going to write a one-line BASIC program — just like we 
would have done back in the day. Open up the emulator, switch to BASIC mode, and type:

```basic
10 PRINT "HELLO, WORLD!": GOTO 10
```

Now hit **Enter**, and then type `RUN`.

And there it is — your first program, printing forever. It's basic (literally), 
but it's the classic starting point.

To stop it, press **Caps Shift** + **Space** (which works as **BREAK**) or just 
restart the emulator if needed.

---

## Step 4: Saving and loading code

Back in the 80s, we saved programs to cassette tapes. Today, we'll do it with files.

Inside ZEsarUX, you can emulate tape loading and saving by creating virtual `.TAP` 
files. We'll cover this properly when we start building bigger projects — for now, 
just know it's possible, and we'll return to it soon.

---

## What's next?

Next up, we'll look at how the Spectrum stores graphics in memory — and why drawing 
to the screen isn't as simple as it first seems.

We'll also take our first steps with Z80 assembly — but don't worry, I'll explain 
it all from the ground up.

This is the start of something special. The 48K Spectrum may be limited, but we're 
going to do some very cool things with it.

Let's make it sing. 