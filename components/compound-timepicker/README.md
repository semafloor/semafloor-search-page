[![GitHub version](https://badge.fury.io/gh/motss%2Fcompound-timepicker.svg)](https://badge.fury.io/gh/motss%2Fcompound-timepicker)
[![Bower version](https://badge.fury.io/bo/compound-timepicker.svg)](https://badge.fury.io/bo/compound-timepicker)

compound-timepicker
============

![dark-themed-compound-timepicker-portrait](https://cloud.githubusercontent.com/assets/10607759/10778479/b10e64b6-7d61-11e5-992a-cf0fd0fb8563.png)
![google-clock-themed-compound-timepicker-portrait](https://cloud.githubusercontent.com/assets/10607759/10778483/b15857ce-7d61-11e5-8321-c05ae856acea.png)
![light-themed-compound-timepicker-portrait](https://cloud.githubusercontent.com/assets/10607759/10778482/b11911d6-7d61-11e5-8637-9f8bcc2d4ffb.png)
![dark-themed-compound-timepicker](https://cloud.githubusercontent.com/assets/10607759/10778478/b10ac90a-7d61-11e5-8109-da9604aebfbc.png)
![google-clock-themed-compound-timepicker](https://cloud.githubusercontent.com/assets/10607759/10778480/b1169a3c-7d61-11e5-9213-ac88ff999028.png)
![light-themed-compound-timepicker](https://cloud.githubusercontent.com/assets/10607759/10778481/b1175314-7d61-11e5-8bae-f0f2ae0d7c26.png)

Compound is composed of two or more separate elements and `compound-timepicker` happens to be under this category.

`compound-timepicker` is a timepicker. It is used to select a single time (hours: minutes) on both mobile and desktop web applications.
The selected time is indicated by the filled circle at the end of each clock hand.

Example:

    <compound-timepicker></compound-timepicker>
    <compound-timepicker hours="23"></compound-timepicker>
    <compound-timepicker minutes="59"></compound-timepicker>
    <compound-timepicker step="5"></compound-timepicker>
    <compound-timepicker time-format="24"></compound-timepicker>

On mobile, pickers are best suited for display in a confirmation dialog. The timepicker can be wrapped inside a `paper-dialog`. `compound-timepicker-dialog` is created alongside `compound-timepicker` to provide a easy-to-use dialog timepicker.

Example:

    <compound-timepicker-dialog></compound-timepicker-dialog>
    <compound-timepicker-dialog hours="23"></compound-timepicker-dialog>
    <compound-timepicker-dialog minutes="59"></compound-timepicker-dialog>
    <compound-timepicker-dialog step="5"></compound-timepicker-dialog>
    <compound-timepicker-dialog time-format="24"></compound-timepicker-dialog>

## Styling

Style the timepicker with CSS as you would a normal DOM element.
Click [here](http://motss.github.io/compound-timepicker/components/compound-timepicker/index.html#styling) to learn more.

## Coming Soon! Generating your own boilerplate code of the compounds

At the end of the demo, there is a section where user can play around with to generate your own boilerplate code with the attributes provided.

## Getting Started

1. Install with bower  
`bower install --save compound-timepicker`

2. Load the web component and the dependencies

For `compound-timepicker`,

```html
<link rel="import" href="path-to-bower-components/compound-timepicker/compound-timepicker.html">
```
For `compound-timepicker-dialog`,

```html
<link rel="import" href="path-to-bower-components/compound-timepicker/compound-timepicker-dialog.html">
```

## License

[MIT License](http://motss.mit-license.org/) © Rong Sen Ng
