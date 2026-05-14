const { parse } = require('@vue/compiler-sfc');
const fs = require('fs');
let content = fs.readFileSync('./src/views/SmartRecommendation.vue', 'utf8');

const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/);
if (templateMatch) {
  const fullInner = templateMatch[1];
  const lines = fullInner.split('\n');

  console.log('Line 1:', JSON.stringify(lines[0]));
  console.log('Line 2:', JSON.stringify(lines[1]));
  console.log('Line 3:', JSON.stringify(lines[2]));

  // Test with hardcoded equivalent
  const testTemplate = '<template>\n  <div class="smart-recommendation">\n</template>';
  console.log('\nTest with hardcoded:');
  console.log('Template:', JSON.stringify(testTemplate));
  const result = parse(testTemplate, { filename: 'test.vue' });
  console.log('Errors:', result.errors?.length || 0);
  if (result.errors?.length > 0) {
    console.log('First error:', result.errors[0].message);
  }

  // Test with extracted
  const extracted = '<template>\n' + lines[0] + '\n' + lines[1] + '\n</template>';
  console.log('\nTest with extracted:');
  console.log('Template:', JSON.stringify(extracted));
  const result2 = parse(extracted, { filename: 'test.vue' });
  console.log('Errors:', result2.errors?.length || 0);
  if (result2.errors?.length > 0) {
    console.log('First error:', result2.errors[0].message);
  }
}