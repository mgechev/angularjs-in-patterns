# AngularJS Patterns

# Abstract

This document describes different design patterns used in AngularJS or any AngularJS application, their purpose and applications.

# Introduction

The document begins with brief overview of the AngularJS framework. The overview explains the main AngularJS components - directives, filters, controllers, services, scope. Next sections describes the different design patterns used in the different component.

# AngularJS overview

AngularJS is JavaScript framework developed by Google. It intents to provide solid base for the development of CRUD Single-Page Applications (SPA).
SPA is web application, which doesn't require page reload when the user performs different actions. This means that all the web application should be loaded with the initial request or better - the information and resources should be loaded on demand.
Since most of the CRUD applications has common characteristics and requirenments AngularJS intents to provide the optimal set of them out-of-the-box. Few important features of AngularJS are:

- two-way databinding
- dependency injection
- separation of concerns
- testability
- abstraction

The separation of concerns is achieved by dividing each AngularJS application into separate components, such as:

- filters
- directives
- controllers
- services
- partials

These components can be grouped inside different modules, which helps to achieve higher level of abstraction when required.