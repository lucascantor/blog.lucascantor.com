const moduleName = require('../helpers/moduleName');
const { DateTime } = require('luxon');

const body = (date) => {
  let dateToISO = DateTime.fromJSDate(date);
  let difference = dateToISO.diffNow('months').toObject();

  if (difference.months < -24) {
    return `<div class="admonition warning">
       <div class="admonition-title">
        <span class="admonition-icon warning"></span>
        Old Post
      </div>
      <div class="admonition-content">
        This post is over two years old. Content may be out of date.
      </div>
    </div>`;
  } else {
    return ``;
  }
};

module.exports = {
  name: moduleName(__filename),
  body,
};
