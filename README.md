# supic
Neural network based image processing tool  



Built with [Electron](https://electron.atom.io/) and Python3.5
 
 *the communication part between electron and python is inspired by [this repo](https://github.com/fyears/electron-python-example)*

## The meaning of such a tool
**TL;DR:**  
A central demo platform for those lattest CV papers

Say you, a tech fan, have seen an amazing Computer Vision work, [Laplacian Pyramid Super-Resolution](http://vllab1.ucmerced.edu/~wlai24/LapSRN/), for example, via blog or news or forums or whatever. You think it's awesome and want to give it a try (use your image). Sadly, after some search you only find that you have to install matlab, matconvnet, download model and do some tricky command-line related work to get your result. And this is even not relatively painful compared with most CV work.

The real big problem is lots of CV paper authors not releasing their code or trained-model. There are, of course, [many reasonable considerations.](https://softwareengineering.stackexchange.com/questions/171332/why-dont-research-papers-that-mention-custom-software-release-the-source-code) This phenomenon, which actually is common in code-related research fields, leads to a huge gap between the frontier and the public. There should be a bridge, and this tool is one step towards the goal, at least in the CV field.

## Features and background
### 1. Super Resolution

* [Photo-Realistic Single Image Super-Resolution Using a Generative Adversarial Network](https://arxiv.org/abs/1609.04802)

* [Neural Enhance](https://github.com/alexjc/neural-enhance)

[Theano](http://deeplearning.net/software/theano/index.html) is used

### 2. Depth Estimation
* [Unsupervised Monocular Depth Estimation
with Left-Right Consistency](http://visual.cs.ucl.ac.uk/pubs/monoDepth/)

[Tensorflow](https://www.tensorflow.org/) is used

## How to install
cd to the project root directory in your terminal, then:
1. Make sure you have installed [`nodejs`](https://nodejs.org/en/), version >= 7.4.0
2. (This is for mac users)  
    `npm install fsevents -g`

3. `npm install electron@1.6.11 ` 
4. `npm install --runtime=electron --target=1.6.11`
5. `pip3 install -r requirements.txt`
6. `./download.sh`

Now you can open the app via `npm start`
