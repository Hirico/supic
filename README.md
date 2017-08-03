# supic
Neural network based image processing tool  



Built with Electron and TensorFlow(Python)
 
 *the communication part between electron and python is inspired by [this repo](https://github.com/fyears/electron-python-example)*

## The meaning of such a tool
---
**TL;DR:**  
A central demo platform for those lattest CV papers

Say you, a tech fan, have seen an amazing Computer Vision work, [Laplacian Pyramid Super-Resolution](http://vllab1.ucmerced.edu/~wlai24/LapSRN/), for example, via blog or news or forums or whatever. You think it's awesome and want to give it a try. Sadly, after some search you only find that you have to install matlab, matconvnet, download model and do some tricky command-line related work to get your result. And this is even not relatively painful compared with most CV work.

The real big problem is lots of CV paper authors not releasing their code or trained-model. There are, of course, [many reasonable considerations.](https://softwareengineering.stackexchange.com/questions/171332/why-dont-research-papers-that-mention-custom-software-release-the-source-code) This phenomenon, which actually is common in code-related research fields, leads to a huge gap between the frontier and the public. There should be a bridge, and this tool is one step towards the goal, at least in CV domain.

## Features and used papers
---
### 1. Super Resolution

[Deep Laplacian Pyramid Networks for Fast and Accurate Super-Resolution](http://vllab1.ucmerced.edu/~wlai24/LapSRN/)

### 2. Depth Estimation
[Unsupervised Monocular Depth Estimation
with Left-Right Consistency](http://visual.cs.ucl.ac.uk/pubs/monoDepth/)

## How to install
---
cd to the project root directory in your terminal, then:
1. Make sure you have installed [`nodejs`](https://nodejs.org/en/), version >= 7.4.0
2. (This is for mac users)  
    `npm install fsevents -g`

3. `npm install electron@1.6.11 ` 
4. `npm install --runtime=electron --target=1.6.11`

Now you can open the app via `npm start`
